import React, { Component } from 'react';
import Form from '../components/Form';

const data = [
	{ label: 'Item 1', value: 0 },
	{ label: 'Item 2', value: 1 },
	{ label: 'Item 3', value: 2 },
];

class FormContainer extends Component {
	render() {
		const fields = [
			{
				key: 'text1',
				type: 'text',
				label: 'Text',
				labelColSize: 1,
				inputColSize: 10,
				placeholder: 'Input Field',
			},
			{
				key: 'select',
				type: 'select',
				label: 'Select',
				labelColSize: 1,
				inputColSize: 10,
				options: data,
				placeholder: '-- SELECT ITEM --',
			},
			{
				key: 'textarea1',
				type: 'textarea',
				label: 'Text Area',
				rows: 10,
				labelColSize: 1,
				inputColSize: 10,
				placeholder: 'Input Field',
			},
			{
				key: 'richtext',
				type: 'richtext',
				label: 'Rich Text',
				labelColSize: 1,
				inputColSize: 10,
			},
			{
				key: 'datepicker',
				type: 'datepicker',
				label: 'Datepicker',
				labelColSize: 1,
				inputColSize: 10,
			},
			{
				key: 'file',
				type: 'file',
				label: 'File',
				labelColSize: 1,
				inputColSize: 10,
			},
		];

		return (
			<Form
				ref="form"
				fields={fields}
			/>
		);
	}
};

export default FormContainer;
