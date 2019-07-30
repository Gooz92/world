const TOKEN_TYPES = [
  {
    pattern: /'|"/,
    type: 'quote'
  },
  {
    pattern: /:|=|;/,
    type: 'key-value-separator'
  }
];

[
  {
    quote: [ 'key', 'value' ],
    key: [ 'quote', 'key-value-separator' ],
    'key-value-separator': [ 'quote', 'value' ],
    value: [ 'entries-separator', 'quote' ]
  }
]

export default function (params) {
  while (params.length > 0) {
    // params.match
  }
}
