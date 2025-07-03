export class ProjectService {
  static async getProjectFiles(projectId: string): Promise<Record<string, string>> {
    if (!projectId) {
      throw new Error('Project ID is required');
    }

    /*
     * In a real application, you would fetch the project files
     * from a database or file storage based on the projectId.
     */
    const files = {
      'src/index.js': "console.log('Hello, world!');",
      'package.json': `{ "name": "my-project", "version": "1.0.0" }`,
    };

    return files;
  }
}
