# Get HTML Content
The `editor.txt.html()` is used to get HTML content.

Note **the html which get from editor doesn't contains any style**.it means that you can implement changing theme function by yourself.if you want to custom the styles for tags such as `<table>`, `<code>`, `<blockquote>` and so on, The editor styles are provided below for your reference：

```css
/* table styles */
table {
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
}
table td,
table th {
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
  padding: 3px 5px;
}
table th {
  border-bottom: 2px solid #ccc;
  text-align: center;
}

/* blockquote styles */
blockquote {
  display: block;
  border-left: 8px solid #d0e5f2;
  padding: 5px 10px;
  margin: 10px 0;
  line-height: 1.4;
  font-size: 100%;
  background-color: #f1f1f1;
}

/* code styles */
code {
  display: inline-block;
  *display: inline;
  *zoom: 1;
  background-color: #f1f1f1;
  border-radius: 3px;
  padding: 3px 5px;
  margin: 0 3px;
}
pre code {
  display: block;
}

/* ul ol styles */
ul, ol {
  margin: 10px 0 10px 20px;
}
```