# Recipe Book Website

A simple website to display recipes from a JSON file.

## Setup Instructions

1. Make sure all files are in the same directory:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `recipes.json`
   - `placeholder.png` (create a simple placeholder image)

2. Create an `images` folder in the same directory to store recipe and ingredient sprites.

3. Add sprite images to the `images` folder. The filenames should match those referenced in `recipes.json`.

## Running Locally

You can run this website locally using any of these methods:

### Using Python's built-in HTTP server

If you have Python installed:

```bash
# Python 3
python -m http.server

# Python 2
python -m SimpleHTTPServer
```

Then open your browser and go to: `http://localhost:8000`

### Using Node.js

If you have Node.js installed, you can use packages like `http-server`:

```bash
# Install http-server globally
npm install -g http-server

# Run the server
http-server
```

### Using GitHub Pages

To deploy this website on GitHub Pages:

1. Create a new GitHub repository
2. Push all files to the repository
3. Go to repository Settings > Pages
4. Set the source to the branch containing your files
5. Your site will be published at `https://[username].github.io/[repository-name]/`

## Customization

To customize this website:

- Edit `styles.css` to change colors, layouts, and other visual elements
- Modify `index.html` to change the page structure
- Update `script.js` to add new functionality or change how recipes are displayed 