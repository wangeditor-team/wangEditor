# Get Or Set JSON Data

## Get JSON
You can use `editor.txt.getJSON()` to get JSON content, the format as follows:

```json
[
    {
        "tag": "p",
        "attrs": [],
        "children": [
            "welcome to use ",
            {
                "tag": "b",
                "attrs": [],
                "children": [ "wangEditor" ]
            },
            "rich text editor"
        ]
    },
    {
        "tag": "p",
        "attrs": [],
        "children": [
            {
                "tag": "img",
                "attrs": [
                    { "name": "src", "value": "xxx.png" },
                    { "name": "style", "value": "max-width:100%;" }
                ]
            }
        ]
    }
]
```

## Set JSON
You can also use `editor.txt.setJSON(json)` API to set JSON content, the json param format must be consistent with mentioned above.

Note `setJSON` API is supported started with v4.3.0.