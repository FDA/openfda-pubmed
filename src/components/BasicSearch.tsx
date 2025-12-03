import React, { useState, useEffect, useMemo, useCallback } from "react"
import { AgGridReact } from "ag-grid-react";
import Select from 'react-select'
import { Alert, TextInput } from '@trussworks/react-uswds'
import CustomLoadingOverlay from "./CustomLoadingOverlay";
import { API_LINK } from "../constants/api";

import '@trussworks/react-uswds/lib/uswds.css'
import '@trussworks/react-uswds/lib/index.css'
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../css/index.scss'
import '../css/components/Search.scss'


const column_map = {
  'standard': [
    {
      field: 'year',
      headerName: 'Year',
      width: 70
    },
    {
      field: 'title',
      headerName: 'Title',
      wrapText: true,
      autoHeight: true,
      flex: 2,
      comparator: (valueA, valueB) => {
        if (valueA.title.toLowerCase() == valueB.title.toLowerCase()) return 0;
        return (valueA.title.toLowerCase() > valueB.title.toLowerCase()) ? 1 : -1;
      },
      cellRenderer:(params) => {
        return <a href={params.value.link} target="_blank">{params.value.title}</a>
      }
    },
    {
      field: 'citation',
      headerName: 'Citation',
      wrapText: true,
      autoHeight: true,
      flex: 3
    }
  ]
}

const year_range = [{value: 'all', label: 'All'}]
for (let year = new Date().getFullYear(); year !== null;) {
  for (let i = 0; i < 5; i++, year = (year > 2022 ? year - 1 : null)) {
    if (year !== null) {
      year_range.push({value: year.toString(), label: year.toString()});
    }
  }
}

export default function BasicSearch({searchHeader, errorText, placeholder, searchField, searchLength, tableType}) {
    const [journals, setJournals] = useState<[] | null>(null)
  const [year, setYear] = useState(year_range[0])
  const [errMsg, setErrMsg] = useState('')
  const [search, setSearch] = useState('')
  const [search_query, setSearchQuery] = useState('')
  const columnDefs = useMemo(() => column_map[tableType], []);
  const defaultColDef = useMemo(() => ({resizable: true, sortable: true}), []);

  useEffect(() => {
    if (search_query === '') {
      return
    } else {
      fetch(search_query)
        .then(response => {
          if (!response.ok){
            throw new Error(response.status + " Failed Fetch");
          }
          return response.json()
        })
        .then(json => {
          let data = []
          json.results.map(result => {
            let title = {}
            if(result.hasOwnProperty('link')){
              title = {'title': result.title,'link': result.link}
            } else {
              title = {'title': result.title, 'file_name': result.file_name}
            }
            data.push({
              'year': result.year,
              'title': title,
              'citation': result.citation,
            })
          })
          setJournals(data)
          setErrMsg('')
        })
        .catch(error => {
          setJournals(null)
          setErrMsg('No results found.')
        });
    }
  }, [search_query])

  const searchHandler = (event) => {
    event.preventDefault()
    event.stopPropagation()
    let search_query = `${API_LINK}/publications/peerreviewed.json?`
    let search_parameter = false
    if (search !== '***') {
      search_parameter = true
      search_query = `${search_query}search=${searchField}:*${search.replace(/[.*+:-?^${}()|[\]\s\\]/g, '\\$&')}*`
    }
    if (search.length < searchLength) {
      setJournals(null)
      setErrMsg(errorText)
    } else {
      if (year.value !== 'all') {
        search_query = `${search_query}${search_parameter?'+AND+':'search='}year:${year.value}`
        search_parameter = true
      }
    }
    setSearchQuery(`${search_query}${search_parameter?'&':''}limit=1000`)
  };

  const onYearChange = (option) => {
    setYear(option)
  }

  const onFirstDataRendered = useCallback((params) => {
    params.api.sizeColumnsToFit();
  }, []);

  const loadingOverlayComponent = useMemo(() => {
    return CustomLoadingOverlay;
  }, []);

  const loadingOverlayComponentParams = useMemo(() => {
    return {
      loadingMessage: 'One moment please...',
    };
  }, []);

  return (
    <div className='bg-white margin-top-3 padding-left-2 padding-right-3 padding-bottom-5'>
      <div className='grid-row flex-column'>
        <div className='grid-col flex-auto padding-1'>
          <b>Search By {searchHeader}:</b>
        </div>
        <form className='minw-205 padding-left-1' onSubmit={searchHandler}>
          <div className='grid-col flex-column'>
            <TextInput
              className='input-padding height-4'
              id={searchField[0]}
              name={searchField[0]}
              type='string'
              value={search}
              onChange={event => setSearch(event.target.value)}
            />
            <div className='padding-top-1 padding-left-05'>({placeholder})</div>
            <div className='grid-col flex-column flex-align-center'>
              <h3>Year:</h3>
              <Select
                name="years"
                options={year_range}
                value={year}
                onChange={onYearChange}
                className="basic-multi-select year-select"
                classNamePrefix="select"
              />
            </div>
          </div>
          <button className='minw-205 usa-button margin-top-2 margin-bottom-2' type='submit'>
            <span className="usa-search__submit-text">Search</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              className="usa-icon usa-icon--size-3 usa-search__submit-icon" focusable="false" role="img"
              name="Search"
            >
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
        </form>
      </div>
      {
        // Display error message if no results found.
        errMsg.length > 0 && (
          <div className='grid-row padding-1'>
            <div className='grid-col flex-auto'>
              <Alert type={"info"} headingLevel={'h1'}>{errMsg}</Alert>
            </div>
          </div>
        )
      }
      <div className='grid-row flex-column'>
        <div className='grid-col padding-left-1'>
          {journals && (
            <div className="ag-theme-alpine margin-bottom-3" style={journals.length <5 ? {height: 250}: {height: 400}}>
              <AgGridReact
                rowData={journals}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                onFirstDataRendered={onFirstDataRendered}
                noRowsOverlayComponent={loadingOverlayComponent}
                noRowsOverlayComponentParams={loadingOverlayComponentParams}
                pagination={true}
                domLayout={journals.length <5 ? 'autoHeight': 'normal'}
              />
            </div>
          )}
        </div>
      </div>
      <h3 className='margin-bottom-0'><a className='padding-1' href='https://open.fda.gov/apis/publications/peerreviewed/'>FDA Journals Documentation</a></h3>
    </div>
  )
}