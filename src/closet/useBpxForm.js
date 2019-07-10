import { useState } from 'react'
import ValidaJS from 'valida-js'

/**
 * @param {*} fields  An object of form field '[key]: value' properties =
 *  {
 *    [key]: value, ...
 *  }
 *
 * @returns The form's 'state' object of '[key]: {input: '', meta:{}' properties =
 *  {
 *    [key]: {
 *      value: '',
 *      meta: {
 *        touched: false,   // set by onClickHandlerByKey
 *        dirty: false      // set by onChangeHandlerByKey
 *    }, ...
 *  }
 */
function stateFactory (fields) {
  return Object.keys(fields).reduce((acc, key) => {
    acc[key] = {
      value: fields[key],
      meta: {
        touched: false,
        dirty: false,
      },
    };
    return acc;
  }, {});
}

/**
 * @param {*} fields An object of form field '[key]: value' properties =
 *  {
 *    [key]: value, ...
 *  }
 *
 * @returns An object of form field 'key: error message array' properties =
 *  {
 *    [key]: [errorMessages], ...
 *  }
 */
function emptyErrorFactory (fields) {
  return Object.keys(fields).reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {});
}

/**
 * @param {*} descriptors Array of objects of:
 * {
 *    name: 'firstName,
 *    type: 'required',
 *    stateMap: 'firstName'
 * }
 * @param {*} validators ValidaJS.validators
 * @returns An object of {[key]: rules} for use by ValidJS
 */
function rulesByNameFactory (descriptors, validators) {
  // Gather each descriptor into a name-based array of its descriptors
  const descriptorBy = descriptors.reduce((acc, descriptor) => {
    acc[descriptor.name] = acc[descriptor.name]
      ? acc[descriptor.name].concat([descriptor])
      : [descriptor];
    return acc;
  }, {});
  return Object.keys(descriptorBy).reduce((acc, key) => {
    acc[key] = ValidaJS.rulesCreator(validators, descriptorBy[key]);
    return acc;
  }, { default: ValidaJS.rulesCreator(validators, descriptors) })
}

/**
 * @returns An object of the state's form field '[key]: value' properties =
 *  {
 *    [key]: value, ...
 *  }
 * Used by onChangeHandlerByKey()
*/
function getDataFromState (state) {
  return Object.keys(state).reduce((acc, key) => {
    acc[key] = state[key].value;
    return acc;
  }, {});
}

/**
 * Returns a new validation object from the old validation object
 * and a field's key and errors
 * @param {*} key The recently validated field key
 * @param {*} validation The old validation object
 * @param {*} newErrors The recently validated field error messages array
 */
function extendsValidations (key, validation, newErrors = []) {
  // Inserts/replaces the errors property for key from an old validation object
  const newValidation = {
    errors: {
      ...validation.errors,
      [key]: newErrors,
    }
  };
  // Add the 'valid' property and return the new validation object
  newValidation['valid'] = Object.keys(newValidation.errors).every(errorKey => {
    return newValidation.errors[errorKey].length === 0;
  })
  return newValidation;
}

/**
 * Returns a new state object updated for the 'key' field's new value and dirty flag
 */
function onChangeHandlerByKey (state, key, setState, setValidation, validation, rulesBy) {
  return (event) => {
    // Create a new state from the existing state and new key value
    const newState = {
      ...state,
      [key]: {
        ...state[key],
        value: event.currentTarget.value,
        meta: {
          ...state[key].meta,
          dirty: true,
        }
      }
    };
    // Check for errors
    const newErrors = ValidaJS.validate(rulesBy[key], getDataFromState(newState)).errors[key]
    // Update the state (form field values)
    //console.log(key+'.onChange() invoked setState()');
    setState(newState);
    // Update the validation errors
    //console.log(key+'.onChange() invoked setValidation()');
    setValidation(extendsValidations(key, validation, newErrors))
  }
}

/**
 * Sets the fields 'touched' flag and updates the state.
 */
function onClickHandlerByKey (state, key, setState) {
  //console.log(key+'.onClick() invoked setState()');
  return (_) => {
    setState({
      ...state,
      [key]: {
        ...state[key],
        meta: {
          ...state[key].meta,
          touched: true
        },
      },
    });
  };
}

function formDataFactory (state, setState, setValidation, validation, rulesBy) {
  return Object.keys(state).reduce((acc, key) => {
    acc[key] = {
      meta: state[key].meta,
      input: {
        value: state[key].value,
        onClick: onClickHandlerByKey(state, key, setState, setValidation, validation, rulesBy),
        onChange: onChangeHandlerByKey(state, key, setState, setValidation, validation, rulesBy)
      }
    };
    return acc;
  }, {});
}

export default function useValitedForm (fields = {}, descriptors = [], validators = ValidaJS.validators) {
  const initialErrorsObj = emptyErrorFactory(fields)
  const initialState = stateFactory(fields)
  const [state, setState] = useState(initialState)
  const [validation, setValidation] = useState({ valid: true, errors: initialErrorsObj })
  const rulesBy = rulesByNameFactory(descriptors, validators)
  const form = formDataFactory(state, setState, setValidation, validation, rulesBy)

  const getData = () => getDataFromState(state)
  const setData = (data) => {
    //console.log('setData() invoked setState()');
    setState(stateFactory(data))
  }
  const validate = () => {
    const newValidations = ValidaJS.validate(rulesBy.default, getDataFromState(state));
    //console.log('validate() invoked setValidation()');
    setValidation({ ...newValidations, errors: { ...initialErrorsObj, ...newValidations.errors } })
    return newValidations.valid
  }

  return [
    form,
    validation,
    validate,
    getData,
    setData
  ]
}
