import { Button } from 'primereact/button';
import React from 'react';
import { translate, openFile, byteSize } from 'react-jhipster';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import moment from 'moment';

export const filterTemplate = (fieldTemp, fieldType, filters, setFilters, relationshipOptions, dataTableRef) => {
  const field = fieldType === 'Relationship' ? fieldTemp + 'Id' : fieldTemp;
  return (
    <div>
      {fieldType === 'LocalDate' || fieldType === 'ZonedDateTime' || fieldType === 'Instant' ? (
        <Calendar
          value={filters[field] && filters[field].value}
          appendTo={document.body}
          onChange={e => {
            dataTableRef.current.filter(e.value ? moment(e.value.valueOf()).format('YYYY-MM-DD') : '', field, 'equals');
          }}
          showTime={fieldType === 'ZonedDateTime' || fieldType === 'Instant' ? true : false}
          showButtonBar={true}
        />
      ) : fieldType === 'Boolean' || fieldType === 'Relationship' || fieldType === 'RelationshipList' || fieldType === 'Enum' ? (
        <MultiSelect
          filter
          appendTo={document.body}
          value={filters[field] && filters[field].value}
          options={
            fieldType === 'Boolean' ? [{ label: 'TRUE', value: true }, { label: 'FALSE', value: false }] : relationshipOptions[field]
          }
          placeholder={translate('smartmanagerFrontendApp.device.home.select')}
          onChange={e => {
            dataTableRef.current.filter(e.value, field, 'in');
          }}
        />
      ) : fieldType === 'Long' ||
        fieldType === 'Integer' ||
        fieldType === 'Double' ||
        fieldType === 'Float' ||
        fieldType === 'BigDecimal' ? (
        <InputText
          value={filters[field] ? filters[field].value : ''}
          keyfilter={fieldType === 'Long' || fieldType === 'Integer' ? 'int' : 'num'}
          onChange={e => {
            const regex = /^-?[1-9][0-9]*(.[0-9]+)?$/;
            if (regex.test(e.currentTarget.value) || e.currentTarget.value === '') {
              dataTableRef.current.filter(e.currentTarget.value, field, 'equals');
            } else {
              setFilters({ ...filters, [field]: { value: e.currentTarget.value } });
            }
          }}
        />
      ) : (
        <InputText
          value={filters[field] ? filters[field].value : ''}
          onChange={e => {
            dataTableRef.current.filter(e.currentTarget.value, field, fieldType === 'String' ? 'contains' : 'equals');
          }}
        />
      )}
    </div>
  );
};

export const fieldTemplate = (entity: any, column: any, history: any, matchUrl) => {
  if (column['fieldType'] === 'entityActionsCRUD') {
    return (
      <div style={{ width: 150, textAlign: 'center' }}>
        <Button
          type="button"
          onClick={() => history.push(`${matchUrl}/${entity.id}`)}
          icon="pi pi-search"
          className="p-button-success"
          style={{ marginRight: '.5em' }}
          tooltip={translate('entity.action.view')}
          tooltipOptions={{ position: 'top' }}
        />
        <Button
          type="button"
          onClick={() => history.push(`${matchUrl}/${entity.id}/edit`)}
          icon="pi pi-pencil"
          className="p-button-warning"
          style={{ marginRight: '.5em' }}
          tooltip={translate('entity.action.edit')}
          tooltipOptions={{ position: 'top' }}
        />
        <Button
          type="button"
          onClick={() => history.push(`${matchUrl}/${entity.id}/delete`)}
          icon="pi pi-times"
          className="p-button-danger"
          style={{ marginRight: '.5em' }}
          tooltip={translate('entity.action.delete')}
          tooltipOptions={{ position: 'top' }}
        />
      </div>
    );
  } else if (column['fieldType'] === 'Boolean') {
    return <span>{entity[column['field']] ? 'true' : 'false'}</span>;
  } else if (column['fieldType'] === 'Relationship') {
    return <span>{entity[column['field'] + column['otherEntityFieldCapitalized']]}</span>;
  } else if (column['fieldType'] === 'blob') {
    return (
      <div>
        {entity[column['field']] ? (
          <div>
            <a onClick={openFile(entity[column['field'] + 'ContentType'], entity[column['field']])}>
              {translate('entity.action.open')}
              &nbsp;
            </a>
            <span>
              {entity[column['field'] + 'ContentType']}, {byteSize(entity[column['field']])}
            </span>
          </div>
        ) : null}
      </div>
    );
  } else if (column['fieldType'] === 'blobImage') {
    return (
      <div>
        {entity[column['field']] ? (
          <div>
            <a onClick={openFile(entity[column['field'] + 'ContentType'], entity[column['field']])}>
              <img src={`data:${entity[column['field']]}ContentType;base64,${entity[column['field']]}`} style={{ maxHeight: '30px' }} />
              &nbsp;
            </a>
            <span>
              {entity[column['field'] + 'ContentType']}, {byteSize(entity[column['field']])}
            </span>
          </div>
        ) : null}
      </div>
    );
  } else if (column['fieldType'] === 'RelationshipList') {
    return (
      <div>
        <ul>{entity[column['field']] && entity[column['field']].map(val => <li key={val.id}>{val[column['otherEntityField']]}</li>)}</ul>
      </div>
    );
  } else {
    return <span>{entity[column['field']]}</span>;
  }
};
