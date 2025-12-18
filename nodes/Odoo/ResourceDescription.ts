import { INodeProperties } from 'n8n-workflow';

export const resourceOperations: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		default: '',
		description: 'Choose from the list',
		typeOptions: {
			loadOptionsMethod: 'getModels',
		},
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		default: '',
		description: 'Choose from the list',
		typeOptions: {
			loadOptionsMethod: 'getOperations',
		},
	},
];

export const resourceDescription: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                custom:create                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Fields',
		name: 'fieldsToCreateOrUpdate',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			multipleValueButtonText: 'Add Field',
		},
		default: {},
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Field Record:',
				name: 'fields',
				values: [
					{
						displayName: 'Field Name',
						name: 'fieldName',
						type: 'options',
						default: '',
						typeOptions: {
							loadOptionsMethod: 'getModelFields',
						},
					},
					{
						displayName: 'New Value',
						name: 'fieldValue',
						type: 'string',
						default: '',
					},
				],
			},
		],
	},

	/* -------------------------------------------------------------------------- */
	/*                                custom:get                                  */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'ID',
		name: 'id',
		type: 'string',
		description: 'The resource ID',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: ['get', 'delete', 'update', 'copy', 'exists'],
			},
		},
	},
	/* -------------------------------------------------------------------------- */
	/*                                custom:getAll                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				operation: ['getAll', 'search'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},

	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				operation: ['getAll', 'search'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 0,
		},
		description: 'Number of results to skip',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		displayOptions: {
			show: {
				operation: ['getAll', 'search'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		default: {},
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				operation: ['getAll', 'get', 'readGroup', 'copy', 'nameSearch', 'checkAccessRights'],
			},
		},
		options: [
			{
				displayName: 'Default Values (Copy)',
				name: 'defaultValues',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						'/operation': ['copy'],
					},
				},
				default: {},
				options: [
					{
						name: 'fields',
						displayName: 'Field',
						values: [
							{
								displayName: 'Field Name',
								name: 'fieldName',
								type: 'options',
								default: '',
								typeOptions: {
									loadOptionsMethod: 'getModelFields',
								},
							},
							{
								displayName: 'Default Value',
								name: 'fieldValue',
								type: 'string',
								default: '',
							},
						],
					},
				],
			},
			{
				displayName: 'Fields To Include',
				name: 'fieldsList',
				type: 'multiOptions',
				default: [],
				typeOptions: {
					loadOptionsMethod: 'getModelFields',
					loadOptionsDependsOn: ['resource'],
				},
			},
			{
				displayName: 'Group By Names or IDs',
				name: 'groupBy',
				type: 'multiOptions',
				default: [],
				displayOptions: {
					show: {
						'/operation': ['readGroup'],
					},
				},
				typeOptions: {
					loadOptionsMethod: 'getModelFields',
					loadOptionsDependsOn: ['resource'],
				},
				description: 'Fields to group by. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Lazy Grouping',
				name: 'lazy',
				type: 'boolean',
				default: true,
				displayOptions: {
					show: {
						'/operation': ['readGroup'],
					},
				},
				description: 'Whether to use lazy grouping',
			},
			{
				displayName: 'Order By',
				name: 'orderBy',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						'/operation': ['readGroup'],
					},
				},
				description: 'Field to order results by (e.g., "name ASC")',
			},
			{
				displayName: 'Raise Exception',
				name: 'raiseException',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						'/operation': ['checkAccessRights'],
					},
				},
				description: 'Whether to raise an exception if access is denied',
			},
			{
				displayName: 'Search Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				displayOptions: {
					show: {
						'/operation': ['nameSearch'],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 1000,
				},
				description: 'Max number of results to return',
			},
		],
	},
	{
		displayName: 'Filters',
		name: 'filterRequest',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			multipleValueButtonText: 'Add Filter',
		},
		default: {},
		description: 'Filter request by applying filters',
		placeholder: 'Add condition',
		displayOptions: {
			show: {
				operation: ['getAll', 'search', 'searchCount', 'nameSearch', 'readGroup'],
			},
		},
		options: [
			{
				name: 'filter',
				displayName: 'Filter',
				values: [
					{
						displayName: 'Field',
						name: 'fieldName',
						type: 'options',
						default: '',
						typeOptions: {
							loadOptionsDependsOn: ['resource'],
							loadOptionsMethod: 'getModelFields',
						},
					},
					{
						displayName: 'Operator',
						name: 'operator',
						type: 'options',
						default: 'equal',
						description: 'Specify an operator',
						options: [
							{
								name: '!=',
								value: 'notEqual',
							},
							{
								name: '<',
								value: 'lesserThen',
							},
							{
								name: '<=',
								value: 'lesserOrEqual',
							},
							{
								name: '=',
								value: 'equal',
							},
							{
								name: '>',
								value: 'greaterThen',
							},
							{
								name: '>=',
								value: 'greaterOrEqual',
							},
							{
								name: 'Child Of',
								value: 'childOf',
							},
							{
								name: 'In',
								value: 'in',
							},
							{
								name: 'Like',
								value: 'like',
							},
							{
								name: 'Not In',
								value: 'notIn',
							},
						],
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Specify value for comparison',
					},
				],
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                                custom:update                               */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'ID',
		name: 'id',
		type: 'string',
		description: 'The resource ID',
		default: '',
		required: true,

		displayOptions: {
			show: {
				operation: ['update'],
			},
		},
	},

	{
		displayName: 'Update Fields',
		name: 'fieldsToCreateOrUpdate',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
			multipleValueButtonText: 'Add Field',
		},
		default: {},
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Field Record:',
				name: 'fields',
				values: [
					{
						displayName: 'Field Name',
						name: 'fieldName',
						type: 'options',
						default: '',
						typeOptions: {
							loadOptionsMethod: 'getModelFields',
						},
					},
					{
						displayName: 'New Value',
						name: 'fieldValue',
						type: 'string',
						default: '',
					},
				],
			},
		],
	},

	/* -------------------------------------------------------------------------- */
	/*                              New Operations                                */
	/* -------------------------------------------------------------------------- */

	// Name Get operation - requires comma-separated IDs
	{
		displayName: 'IDs',
		name: 'ids',
		type: 'string',
		description: 'Comma-separated list of record IDs',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: ['nameGet'],
			},
		},
	},

	// Name Search operation - requires search term
	{
		displayName: 'Search Term',
		name: 'name',
		type: 'string',
		description: 'Text to search for in record names',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: ['nameSearch'],
			},
		},
	},

	// Check Access Rights - operation type
	{
		displayName: 'Access Operation',
		name: 'accessOperation',
		type: 'options',
		description: 'Type of access to check',
		default: 'read',
		required: true,
		displayOptions: {
			show: {
				operation: ['checkAccessRights'],
			},
		},
		options: [
			{
				name: 'Read',
				value: 'read',
			},
			{
				name: 'Write',
				value: 'write',
			},
			{
				name: 'Create',
				value: 'create',
			},
			{
				name: 'Delete',
				value: 'unlink',
			},
		],
	},
];
