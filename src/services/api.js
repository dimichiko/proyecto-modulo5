export async function getPosts() {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!response.ok) {
      throw new Error('Error fetching posts');
    }
    return await response.json();
  }