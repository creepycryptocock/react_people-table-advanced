import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useParams } from 'react-router-dom';
import { getPeople } from '../api';
import { Person } from '../types';
import { Loader } from './Loader';

export const PeopleTable = () => {
  const [searchParams] = useSearchParams();
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { slug } = useParams();
  const sex = searchParams.get('sex');
  const query = searchParams.get('query');
  const centuries = searchParams.getAll('centuries');

  function filterPeople(_people: Person[]): Person[] {
    let persons = _people;

    if (sex) {
      persons = persons.filter(person => person.sex === sex);
    }

    if (query?.trim()) {
      persons = persons.filter(person => {
        const normalizedQuery = query.toLowerCase();

        return (
          person.name.toLowerCase().includes(normalizedQuery) ||
          person.fatherName?.toLowerCase().includes(normalizedQuery) ||
          person.motherName?.toLowerCase().includes(normalizedQuery)
        );
      });
    }

    if (centuries.length > 0) {
      persons = persons.filter(person => {
        const century = String(Math.ceil(person.born / 100));

        return centuries.includes(century);
      });
    }

    return persons;
  }

  const visiblePeople = filterPeople(people);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        setLoading(true);
        setError(false);
        const data = await getPeople();

        setPeople(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPeople();
  }, []);

  // Helper to find person by name
  const findPersonByName = (name: string): Person | undefined => {
    return people.find(person => person.name === name);
  };

  // Helper to create a Link for mother/father
  const createPersonLink = (name: string): JSX.Element => {
    const person = findPersonByName(name);

    if (!person) {
      return <span>{name}</span>;
    }

    const linkClass = person.sex === 'f' ? 'has-text-danger' : '';

    return (
      <Link to={`/people/${person.slug}`} className={linkClass}>
        {name}
      </Link>
    );
  };

  return (
    <div>
      <h1 className="title">People Page</h1>

      <div className="block">
        <div className="box table-container">
          {loading && <Loader />}

          {error && (
            <p data-cy="peopleLoadingError" className="has-text-danger">
              Something went wrong
            </p>
          )}

          {!loading && !error && people.length === 0 && (
            <p data-cy="noPeopleMessage">There are no people on the server</p>
          )}

          {!loading && !error && people.length > 0 && (
            <table
              data-cy="peopleTable"
              className="table is-striped is-hoverable is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Sex</th>
                  <th>Born</th>
                  <th>Died</th>
                  <th>Mother</th>
                  <th>Father</th>
                </tr>
              </thead>
              <tbody>
                {visiblePeople.map(person => (
                  <tr
                    key={person.slug}
                    data-cy="person"
                    className={
                      slug === person.slug ? 'has-background-warning' : ''
                    }
                  >
                    <td>
                      <Link
                        to={`/people/${person.slug}`}
                        className={person.sex === 'f' ? 'has-text-danger' : ''}
                      >
                        {person.name}
                      </Link>
                    </td>
                    <td>{person.sex}</td>
                    <td>{person.born}</td>
                    <td>{person.died}</td>
                    <td>
                      {person.motherName
                        ? createPersonLink(person.motherName)
                        : '-'}
                    </td>
                    <td>
                      {person.fatherName
                        ? createPersonLink(person.fatherName)
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
