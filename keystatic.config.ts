// keystatic.config.ts
import { config, fields, collection } from '@keystatic/core';

let dateFields = {
	precision: fields.conditional(
		fields.select({
			label: 'Precision',
			description: 'How exact this date is.',
			options: [
				{ label: 'Day', value: 'day' },
				{ label: 'Month', value: 'month' },
				{ label: 'Year', value: 'year' },
				{ label: 'Era / Age', value: 'era' },
				{ label: 'Unspecified', value: 'unspecified' },
			],
			defaultValue: 'year',
		}),
		{
			day: fields.object({
				year: fields.integer({ label: 'Year', validation: { min: 0 } }),
				month: fields.integer({ label: 'Month', validation: { min: 0 } }),
				day: fields.integer({ label: 'Day', validation: { min: 0 } }),
			}),
			month: fields.object({
				year: fields.integer({ label: 'Year', validation: { min: 0 } }),
				month: fields.integer({ label: 'Month', validation: { min: 0 } }),
			}),
			year: fields.object({
				year: fields.integer({ label: 'Year', validation: { min: 0 } }),
			}),
			era: fields.relationship({ 
				label: 'Era / Age',
				description: 'Select an era or age defined in this story universe.',
				collection: 'eras', 
			}),
			unspecified: fields.empty(),
		}
	)
}

let createBasicFormFields = (collectionId) => {

	let dateVerbExamples = {
		start: {
			people: 'born, created',
			places: 'founded, discovered',
			things: 'invented, created',
			events: 'started',
			systems: 'established, introduced',
			creatures: 'born, evolved, discovered',
		},
		end: {
			people: 'died, destroyed',
			places: 'dissolved, abandoned',
			things: 'forgotten, destroyed',
			events: 'ended',
			systems: 'abolished, overthrown',
			creatures: 'died, exterminated',
		}
	}

	let basicFields = {
		title: fields.slug({
			name: {
				label: 'Title',
				description: 'The name or primary heading for this entry.',
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
		meta: fields.object({
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
		}),
		thumbnail: fields.image({
			label: 'Thumbnail',
			description: 'A small image used to represent this entry in lists, previews, or cards.'
		}),
		universe: fields.relationship({
			label: 'Story Universe',
			description: '',
			collection: 'universes',
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
				...dateFields,
				verb: fields.text({
					label: 'Date Verb',
					description: dateVerbExamples.start[collectionId] ? `A verb describing what this date represents (e.g., ${dateVerbExamples.start[collectionId]}).` : `A verb describing what this date represents.`,
				})
			},
			{
				label: 'Start Date',
				description: 'The in-world date marking the beginning of this entry’s existence.'
			}
		),
		endDate: fields.object(
			{
				...dateFields,
				verb: fields.text({
					label: 'Date Verb',
					description: dateVerbExamples.end[collectionId] ? `A verb describing what this date represents (e.g., ${dateVerbExamples.end[collectionId]}).` : `A verb describing what this date represents.`,
				})
			},
			{
				label: 'End Date',
				description: 'The in-world date marking the end of this entry’s existence.'
			}
		),
	}

	if (collectionId === 'events') {

		basicFields['keystone'] = fields.checkbox({
			label: 'Keystone Event',
			description: 'This event will appear in all timelines in this story universe.',
			defaultValue: false,
		});

	}

	return basicFields;

}

let basicContentFields = {
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
}

let createEntryTypeField = (entryCollectionId) => {

	return {
		entryType: fields.conditional(
			fields.select({
				label: 'Entry Type',
				description: `Containers can include standalone or container child entries of the same entry category (e.g. Family, Country, Ship, War, Government, Species). Standalone entries are indivisible (e.g. Person, City, Artifact, Battle, Agency, Subspecies).`,
				options: [
					{ label: 'Standalone', value: 'standalone' },
					{ label: 'Container', value: 'container' }
				],
				defaultValue: 'standalone',
			}),
			{
				standalone: fields.empty(),
				container: fields.array(
					fields.relationship({
						label: 'Child Entry',
						description: 'Select an entry to include as a child of this container.',
						collection: entryCollectionId,
					}),
					{
						label: 'Child Entries',
						description: 'Entries that exist directly within this container (e.g. Member of a family, City of a country, Battle of a war).',
					}
				)
			}
		)
	}

}

let createRelationalConnectionsField = (entryCollectionId) => {

	let typeExamples = {
		people: {
			people: 'mentor, sibling, partner',
			places: 'home, hideout',
			things: 'equipment, heirloom',
			events: 'participant, victim',
			systems: 'administrator, user',
			creatures: 'pet, companion',
		},
		places: {
			people: 'resident, mayor',
			places: 'neighbouring city, capital',
			things: 'landmark, monument',
			events: 'discovery, battle',
			systems: 'governing body, economic theory, religion',
			creatures: 'fauna, flora',
		},
		things: {
			people: 'owner, wielder',
			places: 'stored at, located in',
			things: 'component, accessory',
			events: 'used in, lost during',
			systems: 'powered by, maintained by',
			creatures: 'tamed by, produced by',
		},
		events: {
			people: 'instigator, victor, witness',
			places: 'occured in, changed by',
			things: 'weapon, relic, artifact, invention',
			events: 'preceded by, triggered by',
			systems: '',
			creatures: 'ally, enemy, victim',
		},
		systems: {
			people: 'administrator, participant',
			places: 'governs, applies to',
			things: 'component, resource',
			events: '',
			systems: 'subsystem',
			creatures: 'monitored by, controlled by',
		},
		creatures: {
			people: 'owner, tamer',
			places: 'habitat, territory',
			things: 'toy, tool',
			events: 'participant, victim',
			systems: 'part of ecosystem, under control of',
			creatures: 'prey, parasite',
		}
	}

	let createConnectionBranch = (targetCollectionId) => {

		let typeDescription = typeExamples[entryCollectionId]?.[targetCollectionId]?.trim() ? `Short description of the kind of relationship or connection (e.g., ${typeExamples[entryCollectionId]?.[targetCollectionId]}).` : `Short description of the kind of relationship or connection.`;

		return fields.object({
			reference: fields.relationship({
				label: 'Entry Reference',
				description: 'Link to this connection’s full entry, if they exist in the database.',
				collection: targetCollectionId,
			}),
			type: fields.text({
				label: 'Connection Type',
				description: typeDescription,
			}),
		})

	}

	let nestedFields = {
		title: fields.text({
			label: 'Name',
			description: 'Visible label identifying the relationship or connection.'
		}),
		category: fields.conditional(
			fields.select({
				label: 'Category',
				description: 'What kind of entry are you connecting to?',
				options: [
					{ label: 'Person', value: 'people' },
					{ label: 'Place', value: 'places' },
					{ label: 'Thing', value: 'things' },
					{ label: 'Event', value: 'events' },
					{ label: 'System', value: 'systems' },
					{ label: 'Creature', value: 'creatures' },
				],
				defaultValue: 'people',
			}),
			{
				people: createConnectionBranch('people'),
				places: createConnectionBranch('places'),
				things: createConnectionBranch('things'),
				events: createConnectionBranch('events'),
				systems: createConnectionBranch('systems'),
				creatures: createConnectionBranch('creatures'),
			}
		),
		featured: fields.checkbox({
			label: 'Featured',
			description: 'Highlights this relationship or connection in components that support featured items.'
		})
	}

	return {
		relationships: fields.array(
			fields.object(nestedFields),
			{
				label: 'Relationships and Connections',
				description: `Person, place, thing, event, system, or creature that has an important relationship or connection to this entry. For structural relationships (e.g., family members, locations within places, components of things, sub-events, subsystems, subspecies), use the "Entry Type" field above to create parent/child relationships instead.`,
				itemLabel: (item) => item.fields.title.value || 'Untitled',
			}
		)
	}
}

let createEntryCollection = (collectionId) => {

	let label = collectionId.charAt(0).toUpperCase() + collectionId.slice(1);

	return collection({
		label,
		columns: ['universe', 'title'],
		path: `src/content/${collectionId}/*/`,
		slugField: 'title',
		entryLayout: 'content',
		format: {
			contentField: 'description',
		},
		schema: {
			...createBasicFormFields(collectionId),
			...createEntryTypeField(collectionId),
			...basicContentFields,
			...createRelationalConnectionsField(collectionId),
			draftNotes: fields.text({
				label: 'Draft Notes',
				description: 'Private notes for development. Not published.',
				multiline: true,
			})
		}
	})
}

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
		universes: collection({
			label: 'Story Universes',
			columns: ['title'],
			slugField: 'title',
			path: `src/content/universes/*/`,
			schema: {
				title: fields.slug({
					name: {
						label: 'Title',
						description: 'The name of this story universe.',
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
				meta: fields.object({
					published: fields.checkbox({
						label: 'Published',
						defaultValue: true,
						description: 'Controls whether this entry and all child entries are visible on the public site.',
					}),
					dateCreated: fields.date({
						label: 'Date Created',
						defaultValue: { kind: "today" },
					}),
					dateUpdated: fields.date({
						label: 'Date Updated',
						description: 'Set this to the date the entry was last revised.',
						defaultValue: { kind: "today" },
					}),
				}),
				// eras: fields.array() // Eras as events?
			}
		}),

		eras: collection({
			label: 'Eras / Ages',
			columns: ['universe', 'title'],
			slugField: 'title',
			path: `src/content/eras/*/`,
			schema: {
				title: fields.slug({
					name: {
						label: 'Title',
						description: 'The name of this era or age.',
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
				meta: fields.object({
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
				}),
				universe: fields.relationship({
					label: 'Story Universe',
					description: 'The story universe this era or age belongs to.',
					collection: 'universes',
				}),
				order: fields.integer({
					label: 'Timeline Order',
					description: 'Numerical order of this era or age within the story universe timeline, with 0 being the oldest. Orders of the same value will be sorted alphabetically by title.',
					defaultValue: 0,
				}),
				startDate: fields.object(dateFields, {
					label: 'Start Date',
					description: 'The in-world date marking the beginning of this era or age.'
				}),
				endDate: fields.object(dateFields, {
					label: 'End Date',
					description: 'The in-world date marking the end of this era or age.'
				}),
			}
		}),

		people: createEntryCollection('people'),
		places: createEntryCollection('places'),
		things: createEntryCollection('things'),
		events: createEntryCollection('events'),
		systems: createEntryCollection('systems'),
		creatures: createEntryCollection('creatures'),
	},
});