# Hebrew Transliteration Trainer

A simple web‐based trainer that helps you practice transliterating Hebrew into Latin characters. Features:

- Toggle display of **Niqqud** (vowel points) on or off  
- Toggle display of **Translation** after each submission  
- **Dark Mode** toggle for comfortable night‐time practice  
- **Max Niqqud Length** slider to limit practice words by their Niqqud character count  
- **Enter** key submits your answer; click “Next” for a new word  

## Getting Started

1. Clone the repo  
   ```bash
   git clone https://github.com/dwerkjem/Hebrew-Transliteration-Trainer.git
   cd Hebrew-Transliteration-Trainer
   ```
2. Install dependencies  
   ```bash
   npm install
   ```
3. Run in development mode  
   ```bash
   npm run dev
   ```
4. Build for production  
   ```bash
   npm run build
   ```

## Deployment

This project is configured for GitHub Pages. To deploy:

```bash
npm run deploy
```

### Deployment Notes
Be sure to have the `gh-pages` branch set up in your repository. The deployment script will push the built files to this branch.
After running the deploy command, your site will be available at `https://<username>.github.io/<repository-name>/`.

Your site will be published at  
https://dwerkjem.github.io/Hebrew-Transliteration-Trainer/

## Contributing

Feel free to open issues or submit pull requests to add features or improve the UI.

## License

MIT © dwerkjem