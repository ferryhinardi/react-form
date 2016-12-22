import React, { Component } from 'react';
import { SimpleSelect } from 'react-selectize';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import RichTextEditor from 'react-rte';
import styled from 'styled-components';

const Container = styled.div`
	margin: 0 auto;
	padding: 0 1.6rem;
	width: 100%;
`;

const ErrorMessage = styled.div`
	font-size: 1.4rem;
	margin-left: .6rem;
	margin-bottom: -.5rem;
	color: red;
`;

const Row = styled.div`
	width: 100%;
	margin: 0 -1.2rem;

	&:before {
		content: "";
		display: table;
	}
	&:after {
		content: "";
		display: table;
		clear: both;
	}
`;

const Col = styled.div`
	float: left;
	padding: 0 1.2rem;
	line-height: inherit;
`;

const FormGroup = styled.div`
	margin: 0 0 1.2rem;
`;

const LabelInline = styled.label`
	display: block;
	line-height: 3.2rem;
	text-align: right;
`;

const styles = {
	formControl: {
		display: 'inline-block',
    padding: '.7rem 1rem',
    border: 'solid .1rem #c7c7cc',
    borderRadius: '.4rem',
    font: 'inherit',
    outline: '0 !important',
    fontSize: '1rem',
    verticalAlign: 'middle',
    boxShadow: '0 0.1rem 0.1rem rgba(0,0,0,0.06) inset,0 0.1rem 0.2rem rgba(0,0,0,0.06) inset,0 0.1rem 0.3rem rgba(0,0,0,0.06) inset',
	},
	error: {

	},
	disabled: {
		opacity: '.5',
	},
	col1: { width: '8.33333%' },
	col2: { width: '16.66667%' },
	col3: { width: '25%' },
	col4: { width: '33.33333%' },
	col5: { width: '41.66667%' },
	col6: { width: '50%' },
	col7: { width: '58.33333%' },
	col8: { width: '66.66667%' },
	col9: { width: '75%' },
	col10: { width: '83.33333%' },
	col11: { width: '91.66667%' },
	col12: { width: '100%' },
};

const formatDate = 'DD MMM YYYY';

class Form extends Component {
  constructor(props){
    super(props);

		const rteValues = new Map();
		this.state = { rteValues };

		this.getFieldValues = this.getFieldValues.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
  }

	componentWillMount() {
		const rteValues = this.state.rteValues;

		if (this.props.fields.length > 0) {
			this.props.fields.forEach((field) => {
				if (field.type === 'richtext') {
					const isEmptyDefaultValue = !field.defaultValue || field.defaultValue === '';

					if (isEmptyDefaultValue) {
						rteValues.set(field.key, RichTextEditor.createEmptyValue());
					} else {
						rteValues.set(field.key, RichTextEditor.createValueFromString(field.defaultValue, 'html'));
					}
				}
			}, rteValues);

			this.setState(rteValues);
		}
	}

	getFieldValues() {
		const fieldValues = {};
		this.props.fields.forEach((field) => {
			const isMandatory = this.refs.hasOwnProperty(field.key) || field.type === 'datepicker';
			if (isMandatory) {
				if (field.type === 'select') {
					const selectedOption = this.refs[field.key].value();
					fieldValues[field.key] = selectedOption && selectedOption.value;

					if (field.labelKey) {
						fieldValues[field.labelKey] = selectedOption && selectedOption.label;
					}
				} else if (field.type === 'richtext') {
					fieldValues[field.key] = this.state.rteValues.get(field.key).toString('html');
				} else if (field.type === 'datepicker') {
					fieldValues[field.key] = this.state[field.key] ? this.state[field.key].unix() * 1000 : null;
				} else {
					fieldValues[field.key] = ReactDOM.findDOMNode(this.refs[field.key]).value;
				}
			}
		}, this);

		return fieldValues;
	}

	handleSubmit(key, e) {
		e.preventDefault();

		this.props.onSubmit(this.getFieldValues(), key);
	}

	_createHiddenField(field) {
		return (
			<input
				ref={field.key}
				type="hidden"
				value={field.value}
			/>
		);
	}

	_createTextareaField(field) {
		const style = Object.assign({}, styles.formControl,
			{ width: '100%' },
			field.error ? styles.error : null,
			field.readOnly ? styles.disabled : null
		);

		return (
			<textarea
				ref={field.key}
				defaultValue={field.defaultValue || ''}
				value={field.value}
				onChange={field.onChange}
				placeholder={field.placeholder}
				rows={field.rows}
				spellCheck={false}
				maxLength={field.maxLength}
				readOnly={field.readOnly}
				style={style}
			/>
		);
	}

	onRichTextEditorChange(value, fieldKey) {
		const rteValues = this.state.rteValues.set(fieldKey, value);
		this.setState({ rteValues });
	}

	_createRichTextEditorField(field) {
		return (
			<RichTextEditor
				ref={field.key}
				value={this.state.rteValues.get(field.key)}
				onChange={value => this.onRichTextEditorChange(value, field.key)}
			/>
		);
	}

	_createSelectSearchField(field) {
		const mappingField = (options) => {
			const result = [];
			const fieldMap = field.fieldMap;

			options.forEach((option) => {
				const map = {};

				fieldMap.forEach((value) => {
					map[value.target] = option[value.key];
				});

				result.push(map);
			});

			return result;
		};
		const doNothing = () => {};
		const style = Object.assign({}, styles.formControl,
			{ width: '100%' },
			field.error ? styles.error : null,
			field.readOnly ? styles.disabled : null
		);
		const options = field.fieldMap ? mappingField(field.options) : field.options;

		return (
			<SimpleSelect
				ref={field.key}
				style={style}
				options={options}
				defaultValue={field.defaultValue}
				placeholder={field.placeholder || ''}
				filterOptions={field.optionFilter}
				onSearchChange={field.onSearchChange || doNothing}
				onValueChange={field.onValueChange || doNothing}
				renderOption={field.optionRenderer}
				disabled={field.disabled}
			/>
		);
	}

	handleChange(key, onChange, date) {
		this.setState({ [key]: date });
		onChange && onChange(date);
  }

	_createDatePickerField(field) {
		const defaultValue = field.defaultValueIsToday ? field.value || moment() : field.value;
		const _className = field.error ? 'react-datepick__error react-datepick__text_field' : 'react-datepick__text_field';

		return (
			<DatePicker
				name={field.key}
				className={_className}
				todayButton={'Today'}
				dateFormat={field.dateFormat || formatDate}
				disabled={field.disabled}
				readOnly={field.readOnly}
				required={field.required}
				placeholderText={field.placeholder}
				selected={this.state[field.key] ? this.state[field.key] : defaultValue}
				onChange={this.handleChange.bind(this, field.key, field.onChange)}
			/>
		);
	}

	_createFileField(field) {
		const style = Object.assign({}, styles.formControl,
			{ width: '100%' },
			field.error ? styles.error : null,
			field.readOnly ? styles.disabled : null
		);

		const doNothing = () => {};
		const handleShowPromptFile = () => ReactDOM.findDOMNode(this.refs[field.key]).click();

		return (
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
				<input
					ref={field.key}
					type="file"
					style={style}
					accept={field.acceptType || '.csv'}
					onChange={field.onValueChange || doNothing}
				/>
				<button onClick={handleShowPromptFile}>{field.labelButton}</button>
			</div>
		);
	}

	_createInputField(field) {
		const style = Object.assign({}, styles.formControl,
			{ width: '100%' },
			field.error ? styles.error : null,
			field.readOnly ? styles.disabled : null
		);

		return (
			<input
				ref={field.key}
				type={field.type || 'text'}
				defaultValue={field.defaultValue || ''}
				value={field.value}
				placeholder={field.placeholder}
				spellCheck={false}
				readOnly={field.readOnly}
				maxLength={field.maxLength}
				style={style}
			/>
		);
	}

	_createField(field) {
		let input;
		const labelColSize = field.labelColSize || 3;
		const inputColSize = field.inputColSize || (12 - labelColSize);

		switch (field.type) {
		case 'hidden':
				input = this._createHiddenField(field);
				break;
		case 'textarea':
				input = this._createTextareaField(field);
				break;
		case 'richtext':
				input = this._createRichTextEditorField(field);
				break;
		case 'select':
				input = this._createSelectSearchField(field);
				break;
		case 'datepicker':
				input = this._createDatePickerField(field);
				break;
		case 'file':
				input = this._createFileField(field);
				break;
		default:
				input = this._createInputField(field);
		}

		return (
			<FormGroup key={field.key} style={field.type === 'hidden' ? { display: 'none' } : null}>
				<Row>
					<Col style={styles[`col${labelColSize}`]}>
						<LabelInline>{field.label}</LabelInline>
					</Col>
					<Col style={styles[`col${inputColSize}`]}>
						{input}
						{field.error ? <ErrorMessage>{field.error}</ErrorMessage> : null}
					</Col>
				</Row>
			</FormGroup>
		);
	}

	render() {
		const formFields = [];
		const formActions = [];

		(this.props.fields || []).forEach((field) => {
			formFields.push(this._createField(field));

			if (field.hr) formFields.push(<hr key={`${field.key}-hr`} />);
		});

		(this.props.actions || []).forEach((action, index) => {
			const onClick = action.onClick || this.handleSubmit.bind(this, action.key);

			formActions.push(
					<button
							key={`action-${index}`}
							type={action.type || 'submit'}
							onClick={onClick}
					>
							{action.label}
					</button>
			);
		});

		return (
			<Container>
				<form onSubmit={this.handleSubmit} style={{ margin: '0' }}>
					{this.props.children}
					{formFields}
					{formActions}
				</form>
			</Container>
		);
	}
}

export default Form;
