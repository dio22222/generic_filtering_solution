import React, {useEffect, useState} from 'react';
import {OutlinedInput, 
  InputLabel, 
  MenuItem, 
  FormControl, 
  ListItemText,
  Select,
  Checkbox,
} from '@material-ui/core';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 400,
    },
  },
};

export function SelectMultiple({ filterType, filterOptions, filters, group, setFilters }) {
  const [checked, setChecked] = useState([])

  // Event Handler for checking / unchecking a Filter
  const handleOnCheckFilter = (e) => {
    setChecked(previousState => {
      if (e.target.checked) {
        return previousState.concat(e.target.id)
      }

      return previousState.filter(item => item !== e.target.id)
    })
  }

  // Event Handler for onClose event on Filter Selector
  const handleOnCloseFilterSelector = (e) => {
    setFilters(filterType, checked)
  }

  return (
    <div style={{margin: '20px 20px 20px 0'}}>
      <FormControl fullWidth>
        <InputLabel style={{paddingLeft: 10}}>{ filterType }</InputLabel>
        <Select
          multiple
          onClose={handleOnCloseFilterSelector}
          value={filters.map((item, i) => item.group === group && item.name)}
          input={<OutlinedInput label={ filterType } />}
          renderValue={(selected) => selected}
          MenuProps={MenuProps}
        >
          {filterOptions.map((type) => (
            <MenuItem key={type} value={type}>
              <Checkbox id={type} onChange={handleOnCheckFilter} checked={checked.indexOf(type) > -1}/>
              <ListItemText primary={type} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}