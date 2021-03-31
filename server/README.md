
# Server (api)

Possible chartid formats:

(deprecated) 5 chars= `napchart.com/xxxxx`
(deprecated) 6 chars= `napchart.com/xxxxxx`
9 chars snapshot= `napchart.com/snapshot/xxxxxxxxx`
9 chars user chart= `napchart.com/:user/xxxxxxxxx`
9 chars user chart with title= `napchart.com/:user/Some-title-here-xxxxxxxxx`

Chartids are universally unique

## Public API endpoints:

### POST `/v1/createSnapshot`

Body should be:

```ts
Joi.object({
  chartData: chartSchema,
  title: Joi.string().max(100).allow(null, ''),
  description: Joi.string().allow(null, ''),
})
```

Where chartSchema is:

```ts
const colors = ['red', 'blue', 'brown', 'green', 'gray', 'yellow', 'purple', 'pink']

const chartSchema = Joi.object({
  elements: Joi.array().items(
    Joi.object({
      start: Joi.number().integer().min(0).max(1440).required(),
      end: Joi.number().integer().min(0).max(1440).required(),
      lane: Joi.number().required(),
      text: Joi.string().allow('', null),
      color: Joi.string()
        .valid(...colors)
        .required(),
    }),
  ),
  lanes: Joi.number().min(0).required(),
  lanesConfig: Joi.any(),
  shape: Joi.string().valid('circle', 'line', 'wide').required(),
  colorTags: Joi.array().items(Joi.any()),
})
```

### GET `/v1/getChart/:chartid`

A valid chartid will return:

```ts
type ChartCreationReturn = {
  chartDocument: ChartDocument
  publicLink: string
}
```
