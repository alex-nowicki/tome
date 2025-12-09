// keystatic.config.ts
import { config, fields, collection } from '@keystatic/core';

export default config({
	storage: {
		kind: 'github',
		repo: {
			owner: 'alex-nowicki',
			name: 'tome'
		}
	},
	ui: {
		brand: {
			name: 'Tome'
		}
	},
	collections: {

		people: collection({
			label: 'People',
			columns: ['title'],
			slugField: 'title',
			path: 'src/content/people/*/',
			schema: {
				title: fields.slug({
					name: {
						label: 'Title',
						description: 'The person’s name or primary heading for this entry.',
					},
					slug: {
						label: 'Slug',
						description: `Used to generate the page URL. Should be short, lowercase, and contain only URL-safe characters.`,
						validation: {
							length: {
								max: 50,
							}
						},
					}
				}),
				published: fields.checkbox({
					label: 'Published',
					defaultValue: true,
					description: 'Controls whether this entry is visible on the public site.',
				}),
				dateCreated: fields.date({
					label: 'Date Created',
					defaultValue: { kind: "today" }, // Does not auto-update to today on modify.
				}),
				dateUpdated: fields.date({
					label: 'Date Updated',
					description: 'Set this to the date the entry was last revised.',
					defaultValue: { kind: "today" },
				}),
				layout: fields.select({
					label: 'Entry Layout',
					description: `Controls how this entry is presented on the site. Singletons emphasize the entry's content, while Collections emphasize the entries connections.`,
					options: [
						{ label: 'Singleton', value: 'singleton' },
						{ label: 'Collection', value: 'collection' }
					],
					defaultValue: 'singleton',
				}),
				thumbnail: fields.image({
					label: 'Thumbnail',
					description: 'A small image used to represent this person in lists, previews, or cards.'
				}),
				tags: fields.array(
					fields.text({
						label: 'Tag',
					}),
					{
						label: 'Tags',
						description: 'Keywords that help categorize and group this entry. Used for filtering and navigation.',
					}
				),
				startDate: fields.object(
					{
						date: fields.object({
							year: fields.integer({
								label: 'Year',
								validation: {
									min: 0
								}
							}),
							month: fields.integer({
								label: 'Month',
								validation: {
									min: 0
								}
							}),
							day: fields.integer({
								label: 'Day',
								validation: {
									min: 0
								}
							}),
						}),
						label: fields.text({
							label: 'Date Verb',
							description: 'A verb describing what this date represents (e.g., born, created).'
						})
					},
					{
						label: 'Start Date',
						description: 'The date marking the beginning of this person’s life or existence.'
					}
				),
				endDate: fields.object(
					{
						date: fields.object({
							year: fields.integer({
								label: 'Year',
								validation: {
									min: 0
								}
							}),
							month: fields.integer({
								label: 'Month',
								validation: {
									min: 0
								}
							}),
							day: fields.integer({
								label: 'Day',
								validation: {
									min: 0
								}
							}),
						}),
						label: fields.text({
							label: 'Date Verb',
							description: 'A verb describing what this date represents (e.g., died, destroyed).'
						})
					},
					{
						label: 'End Date',
						description: 'The date marking the end of this person’s life or existence.'
					}
				),
				description: fields.mdx({
					label: 'Description',
					description: 'Primary content that appears directly under the page heading.',
					extension: 'md'
				}),
				details: fields.mdx({
					label: 'Details',
					description: 'Optional content displayed in an aside panel.',
					extension: 'md'
				}),
				notableConnections: fields.object(
					{
						people: fields.array(
							fields.object(
								{
									title: fields.text({
										label: 'Person Name',
										description: 'Visible label used in connection lists.'
									}),
									category: fields.select({
										label: 'Connection Category',
										description: 'Type of relationship.',
										options: [
											{ label: 'Family', value: 'family' },
											{ label: 'Friend', value: 'friend' },
											{ label: 'Romance', value: 'romance' },
											{ label: 'Work', value: 'work' },
											{ label: 'Rival', value: 'rival' },
										],
										defaultValue: 'family',
									}),
									type: fields.text({
										label: 'Connection Type',
										description: 'Short description of the specific relationship (e.g., mentor, sibling, partner).',
									}),
									reference: fields.relationship({
										label: 'Entry Reference',
										description: 'Link to this person’s full entry, if they exist in the database.',
										collection: 'people',
									}),
									featured: fields.checkbox({
										label: 'Featured',
										description: 'Highlights this connection in components that support featured items.'
									})
								}
							),
							{
								label: 'People',
								description: 'People who have an important relationship with this person.',
								itemLabel: (props) => props.fields.title.value,
							}
						)

					},
					{
						label: 'Notable Connections',
						description: ''
					}
				)
			}
		}),

		// components: collection({
		// 	label: 'Components',
		// 	columns: ['tag', 'title'],
		// 	slugField: 'title',
		// 	path: 'src/content/components/*/',
		// 	schema: {
		// 		indicator: fields.relationship({
		// 			label: 'Parent Indicator',
		// 			collection: 'indicators',
		// 		}),
		// 		tag: fields.text({
		// 			label: 'Component Tag',
		// 			description: 'Tag must follow the format: [#.#]. Example: 1.1',
		// 			validation: {
		// 				isRequired: true,
		// 				pattern: {
		// 					regex: /^\d\.\d$/,
		// 					message: 'Tag must follow the format: [#.#]. Example: 1.1'
		// 				},
		// 				length: {
		// 					min: 3,
		// 					max: 3,
		// 				}
		// 			},
		// 		}),
		// 		title: fields.slug({
		// 			name: {
		// 				label: 'Name',
		// 				description: 'The component name.',
		// 			},
		// 			slug: {
		// 				label: 'Slug',
		// 				description: `This slug defines the folder and jump link name for this entry. Abbreviate the component name as necessary.`,
		// 				validation: {
		// 					length: {
		// 						max: 50,
		// 					}
		// 				},
		// 			}
		// 		}),
		// 		description: fields.mdx({
		// 			label: 'Description',
		// 			description: `This description defines terms used in the component title and appears directly below the component heading.`,
		// 			extension: 'md',
		// 		}),
		// 		explainerResource: fields.relationship({
		// 			label: 'Explainer Resource',
		// 			collection: 'resources',
		// 		}),
		// 		reflectionQuestion: fields.mdx({
		// 			label: 'Reflection Question',
		// 			extension: 'md',
		// 		}),
		// 		goal: fields.mdx({
		// 			label: 'Goal',
		// 			extension: 'md',
		// 		}),
		// 		initiating: fields.object({
		// 			focus: fields.mdx({
		// 				label: 'Focus',
		// 				extension: 'md',
		// 			}),
		// 			considerations: fields.array(
		// 				fields.object({
		// 					tag: fields.text({
		// 						label: 'Consideration Tag',
		// 						description: 'Tag must follow the format: [#.#.#]. Example: 1.1.1',
		// 						validation: {
		// 							isRequired: true,
		// 							pattern: {
		// 								regex: /^\d\.\d\.\d{1,2}$/,
		// 								message: 'Tag must follow the format: [#.#.#]. Example: 1.1.1'
		// 							},
		// 							length: {
		// 								min: 5,
		// 								max: 6,
		// 							}
		// 						}
		// 					}),
		// 					title: fields.text({
		// 						label: 'Description',
		// 						multiline: true,
		// 					}),
		// 					compass: fields.checkbox({
		// 						label: 'Compass',
		// 						description: 'Flag considerations that respond to learners who have not demonstrated literacy and numeracy proficiency.'
		// 					}),
		// 					categories: fields.array(
		// 						fields.text({
		// 							label: 'Category',

		// 						}),
		// 						{
		// 							label: 'Categories',
		// 							itemLabel: (props) => props.value,
		// 							description: 'These categories will appear next to the consideration tag with a similar styling.',
		// 						})
		// 				}),
		// 				{
		// 					label: 'Considerations',
		// 					itemLabel: (props) => props.fields.tag.value,
		// 				}
		// 			),
		// 		},
		// 			{
		// 				label: 'Phase: Initiating',
		// 			}),
		// 		implementing: fields.object({
		// 			focus: fields.mdx({
		// 				label: 'Focus',
		// 				extension: 'md',
		// 			}),
		// 			considerations: fields.array(
		// 				fields.object({
		// 					tag: fields.text({
		// 						label: 'Consideration Tag',
		// 						description: 'Tag must follow the format: [#.#.#]. Example: 1.1.1',
		// 						validation: {
		// 							isRequired: true,
		// 							pattern: {
		// 								regex: /^\d\.\d\.\d{1,2}$/,
		// 								message: 'Tag must follow the format: [#.#.#]. Example: 1.1.1'
		// 							},
		// 							length: {
		// 								min: 5,
		// 								max: 6,
		// 							}
		// 						}
		// 					}),
		// 					title: fields.text({
		// 						label: 'Description',
		// 						multiline: true,
		// 					}),
		// 					compass: fields.checkbox({
		// 						label: 'Compass',
		// 						description: 'Flag considerations that respond to learners who have not demonstrated literacy and numeracy proficiency.'
		// 					}),
		// 					categories: fields.array(
		// 						fields.text({
		// 							label: 'Category',

		// 						}),
		// 						{
		// 							label: 'Categories',
		// 							itemLabel: (props) => props.value,
		// 							description: 'These categories will appear next to the consideration tag with a similar styling.',
		// 						}),
		// 				}),
		// 				{
		// 					label: 'Considerations',
		// 					itemLabel: (props) => props.fields.tag.value,
		// 				}
		// 			),
		// 		},
		// 			{
		// 				label: 'Phase: Implementing',
		// 			}),
		// 		developing: fields.object({
		// 			focus: fields.mdx({
		// 				label: 'Focus',
		// 				extension: 'md',
		// 			}),
		// 			considerations: fields.array(
		// 				fields.object({
		// 					tag: fields.text({
		// 						label: 'Consideration Tag',
		// 						description: 'Tag must follow the format: [#.#.#]. Example: 1.1.1',
		// 						validation: {
		// 							isRequired: true,
		// 							pattern: {
		// 								regex: /^\d\.\d\.\d{1,2}$/,
		// 								message: 'Tag must follow the format: [#.#.#]. Example: 1.1.1'
		// 							},
		// 							length: {
		// 								min: 5,
		// 								max: 6,
		// 							}
		// 						}
		// 					}),
		// 					title: fields.text({
		// 						label: 'Description',
		// 						multiline: true,
		// 					}),
		// 					compass: fields.checkbox({
		// 						label: 'Compass',
		// 						description: 'Flag considerations that respond to learners who have not demonstrated literacy and numeracy proficiency.'
		// 					}),
		// 					categories: fields.array(
		// 						fields.text({
		// 							label: 'Category',

		// 						}),
		// 						{
		// 							label: 'Categories',
		// 							itemLabel: (props) => props.value,
		// 							description: 'These categories will appear next to the consideration tag with a similar styling.',
		// 						}),
		// 				}),
		// 				{
		// 					label: 'Considerations',
		// 					itemLabel: (props) => props.fields.tag.value,
		// 				}
		// 			),
		// 		},
		// 			{
		// 				label: 'Phase: Developing',
		// 			}),
		// 		sustaining: fields.object({
		// 			focus: fields.mdx({
		// 				label: 'Focus',
		// 				extension: 'md',
		// 			}),
		// 			considerations: fields.array(
		// 				fields.object({
		// 					tag: fields.text({
		// 						label: 'Consideration Tag',
		// 						description: 'Tag must follow the format: [#.#.#]. Example: 1.1.1',
		// 						validation: {
		// 							isRequired: true,
		// 							pattern: {
		// 								regex: /^\d\.\d\.\d{1,2}$/,
		// 								message: 'Tag must follow the format: [#.#.#]. Example: 1.1.1'
		// 							},
		// 							length: {
		// 								min: 5,
		// 								max: 6,
		// 							}
		// 						}
		// 					}),
		// 					title: fields.text({
		// 						label: 'Description',
		// 						multiline: true,
		// 					}),
		// 					compass: fields.checkbox({
		// 						label: 'Compass',
		// 						description: 'Flag considerations that respond to learners who have not demonstrated literacy and numeracy proficiency.'
		// 					}),
		// 					categories: fields.array(
		// 						fields.text({
		// 							label: 'Category',

		// 						}),
		// 						{
		// 							label: 'Categories',
		// 							itemLabel: (props) => props.value,
		// 							description: 'These categories will appear next to the consideration tag with a similar styling.',
		// 						}),
		// 				}),
		// 				{
		// 					label: 'Considerations',
		// 					itemLabel: (props) => props.fields.tag.value,
		// 				}
		// 			),
		// 		},
		// 			{
		// 				label: 'Phase: Sustaining',
		// 			})
		// 	}
		// }),

		// resources: collection({
		// 	label: 'Resources',
		// 	columns: ['type', 'title'],
		// 	slugField: 'title',
		// 	path: 'src/content/resources/*/',
		// 	schema: {
		// 		title: fields.slug({
		// 			name: {
		// 				label: 'Resource Title',
		// 				description: 'Enter the title as it should appear on the website and in links.',
		// 			},
		// 			slug: {
		// 				label: 'Resource Filename',
		// 				description: `Use a short, lowercase, hyphen-separated name (e.g., behaviour-management-pink-envelope). Max 50 characters.`,
		// 				validation: {
		// 					length: {
		// 						max: 50,
		// 					}
		// 				},
		// 			}
		// 		}),
		// 		published: fields.checkbox({
		// 			label: 'Published',
		// 			defaultValue: true,
		// 			description: 'When checked, the resource is visible on the site. Unchecking it hides the resource from public view.',
		// 		}),
		// 		dateAdded: fields.date({
		// 			label: 'Date Added',
		// 			description: 'Defaults to today’s date.',
		// 			defaultValue: { kind: "today" },
		// 		}),
		// 		type: fields.select({
		// 			label: 'Resource Type',
		// 			description: 'Determines icon shown in links and filtering options on the resource page.',
		// 			options: [
		// 				{ label: 'Video', value: 'video' },
		// 				{ label: 'Document', value: 'document' },
		// 				{ label: 'Image', value: 'image' },
		// 				{ label: 'Presentation', value: 'presentation' },
		// 				{ label: 'Audio', value: 'audio' },
		// 				{ label: 'Website', value: 'website' },
		// 			],
		// 			defaultValue: 'video',
		// 		}),
		// 		description: fields.text({
		// 			label: 'Resource Description',
		// 			description: 'Optional short summary or details about the resource.',
		// 			multiline: true,
		// 		}),
		// 		topics: fields.multiselect({
		// 			label: 'Topics',
		// 			description: 'Select topics to categorize the resource for filtering.',
		// 			options: [
		// 				{ label: 'Test', value: 'test' }
		// 			],
		// 		}),
		// 		external: fields.conditional(
		// 			fields.checkbox({
		// 				label: 'External Resource',
		// 				description: 'Check if this resource is hosted on an external website.',
		// 				defaultValue: false
		// 			}),
		// 			{
		// 				true: fields.object({
		// 					url: fields.url({
		// 						label: 'External URL',
		// 						description: 'Provide a full, valid URL to the resource.',
		// 					}),
		// 				}),
		// 				false: fields.object({
		// 					fileType: fields.text({
		// 						label: 'File Type',
		// 						description: "Specify only if different from default: video (.mp4), document (.pdf), image (.png), presentation (.pdf), audio (.mp3).",
		// 					}),
		// 				}),
		// 			}
		// 		),
		// 		linkAction: fields.select({
		// 			label: 'Resource Link Action',
		// 			description: 'Select the resource link action. "Open in dialog" displays the resource in a pop-up window on the same page, while "Open in a new page" navigates to the resource URL.',
		// 			options: [
		// 				{ label: 'Open in dialog', value: 'dialog' },
		// 				{ label: 'Open in a new page', value: 'link' },
		// 			],
		// 			defaultValue: 'dialog',
		// 		}),
		// 		linkedIndicators: fields.array(
		// 			fields.text({
		// 				label: 'Indicator Tag',
		// 				description: 'Use [#] format (e.g., 1). This adds the resource to all components and considerations of the indicator.',
		// 				validation: {
		// 					isRequired: true,
		// 					pattern: {
		// 						regex: /^\d$/,
		// 						message: 'Must match [#] format (e.g., 1)'
		// 					},
		// 					length: {
		// 						min: 1,
		// 						max: 1,
		// 					}
		// 				}
		// 			}), {
		// 			label: 'Linked Indicators',
		// 			itemLabel: props => props.value ?? 'Add indicator tag',
		// 		}
		// 		),
		// 		linkedComponents: fields.array(
		// 			fields.text({
		// 				label: 'Component Tag',
		// 				description: 'Use [#.#] format (e.g., 1.1). This adds the resource to all considerations of the component.',
		// 				validation: {
		// 					isRequired: true,
		// 					pattern: {
		// 						regex: /^\d\.\d$/,
		// 						message: 'Must match [#.#] format (e.g., 1.1)'
		// 					},
		// 					length: {
		// 						min: 3,
		// 						max: 3,
		// 					}
		// 				}
		// 			}), {
		// 			label: 'Linked Components',
		// 			itemLabel: props => props.value ?? 'Add component tag',
		// 		}
		// 		),
		// 		linkedConsiderations: fields.array(
		// 			fields.text({
		// 				label: 'Consideration Tag',
		// 				description: 'Use [#.#.#] format (e.g., 1.1.1). This adds the resource to the consideration.',
		// 				validation: {
		// 					isRequired: true,
		// 					pattern: {
		// 						regex: /^\d\.\d\.\d{1,2}$/,
		// 						message: 'Must match [#.#.#] format (e.g., 1.1.1)'
		// 					},
		// 					length: {
		// 						min: 5,
		// 						max: 6,
		// 					}
		// 				}
		// 			}), {
		// 			label: 'Linked Considerations',
		// 			itemLabel: props => props.value ?? 'Add consideration tag',
		// 		}
		// 		),
		// 	}
		// })
	},
});