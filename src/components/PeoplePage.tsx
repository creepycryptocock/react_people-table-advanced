import { PeopleFilters } from './PeopleFilters';
import { PeopleTable } from './PeopleTable';
import React from 'react';

export const PeoplePage = () => {
  return (
    <>
      <div className="block">
        <div className="columns is-desktop is-flex-direction-row-reverse">
          <div className="column is-7-tablet is-narrow-desktop">
            <PeopleFilters />
          </div>

          <div className="column">
            <div className="box table-container">
              <PeopleTable />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
