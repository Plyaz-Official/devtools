import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function plopfile(plop) {
  plop.setGenerator('story', {
    description: 'Generate a Storybook story for an existing component',
    prompts: [
      {
        type: 'input',
        name: 'path',
        message: 'Path to the component (relative to src/):',
      },
      {
        type: 'input',
        name: 'dirName',
        message: 'Component directory name (e.g., Button):',
      },
      {
        type: 'input',
        name: 'name',
        message: 'Component name (PascalCase):',
      },
    ],
    actions: [
      {
        type: 'add',
        path: path.join(
          process.cwd(),
          'src',
          '{{path}}',
          '{{pascalCase dirName}}',
          '{{pascalCase name}}.stories.tsx'
        ),
        templateFile: path.resolve(__dirname, 'templates/Component.stories.tsx.hbs'),
      },
    ],
  });
}
