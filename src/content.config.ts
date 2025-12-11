// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content';

// 2. Import loader(s)
import { glob, file } from 'astro/loaders';

/**
 * Creates a YYYY-MM-DD date object schema.
 * @returns {import('zod').ZodObject<any>} A date object with year, month, and day.
 */
let createDateSchema = function () {
	return z.object({
		year: z.number().min(0),
		month: z.number().min(0),
		day: z.number().min(0),
	})
}

/**
 * Creates a start/end event schema with a date and descriptive verb.
 * @returns {import('zod').ZodObject<any>} An event schema.
 */
let createEventSchema = function () {
	return z.object({
		date: createDateSchema(),
		label: z.string().optional(),
	})
}

// 3. Define your collection(s)
let people = defineCollection({
	type: 'data',
	schema: z.object({
		title: z.string(),
		slug: z.string().max(50),
		published: z.boolean().default(true),
		dateCreated: z.date().default(new Date()),
		dateUpdated: z.date().default(new Date()),
		layout: z.enum(['singleton', 'collection']).default('singleton'),

		startDate: createEventSchema().optional(),
		endDate: createEventSchema().optional(),

		description: z.string().optional(),
		details: z.string().optional(),

		thumbnail: z.string().optional(),

		tags: z.array(z.string()).optional(),

		notableConnections: z
			.object({
				people: z.array(
					z.object({
						title: z.string(),
						category: z.enum([
							'family',
							'friend',
							'romance',
							'work',
							'rival',
						]),
						type: z.string().optional(),
						reference: z.string().optional(),
						featured: z.boolean().optional(),
					})
				),
			})
			.optional(),
	}),
})

// const components = defineCollection({
// 	loader: glob({ pattern: "**/*.yaml", base: "./src/content/components" }),
// 	schema: z.object({
// 		indicator: z.string(),
// 		tag: z.string(),
// 		title: z.string(),
// 		explainerResource: z.optional(z.string()),
// 		initiating: z.object({
// 			considerations: z.array(
// 				z.object({
// 					tag: z.string(),
// 					title: z.string(),
// 					compass: z.boolean(),
// 					categories: z.array(z.string()),
// 				})
// 			)
// 		}),
// 		implementing: z.object({
// 			considerations: z.array(
// 				z.object({
// 					tag: z.string(),
// 					title: z.string(),
// 					compass: z.boolean(),
// 					categories: z.array(z.string()),
// 				})
// 			)
// 		}),
// 		developing: z.object({
// 			considerations: z.array(
// 				z.object({
// 					tag: z.string(),
// 					title: z.string(),
// 					compass: z.boolean(),
// 					categories: z.array(z.string()),
// 				})
// 			)
// 		}),
// 		sustaining: z.object({
// 			considerations: z.array(
// 				z.object({
// 					tag: z.string(),
// 					title: z.string(),
// 					compass: z.boolean(),
// 					categories: z.array(z.string()),
// 				})
// 			)
// 		}),
// 	})
// });

// const resources = defineCollection({
// 	loader: glob({ pattern: "**/*.yaml", base: "./src/content/resources" }),
// 	schema: z.object({
// 		title: z.string(),
// 		published: z.boolean(),
// 		dateAdded: z.date(),
// 		description: z.optional(z.string()),
// 		type: z.string(),
// 		topics: z.array(z.string()),
// 		external: z.object({
// 			discriminant: z.boolean(),
// 			value: z.optional(z.object({
// 				url: z.optional(z.string()),
// 				fileType: z.optional(z.string()),
// 			}))
// 		}),
// 		linkAction: z.string(),
// 		linkedIndicators: z.array(z.string()),
// 		linkedComponents: z.array(z.string()),
// 		linkedConsiderations: z.array(z.string()),
// 	})
// });

// 4. Export a single `collections` object to register your collection(s)
export const collections = { people };