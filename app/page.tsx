import Button from "./components/Button";

interface GitHubFile {
  name: string;
}

async function getSchedules() {
  try {
    const response = await fetch('https://api.github.com/repos/T00287895/schedule/contents/', {
      next: { revalidate: 3600 }
    });
    if (!response.ok) throw new Error('Failed to fetch schedule list');
    const data: GitHubFile[] = await response.json();
    return data
      .filter(item => item.name.endsWith('.json'))
      .map(item => item.name.replace('.json', ''));
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Home() {
  const schedules = await getSchedules();

  return (
    <main className="flex min-h-screen items-start justify-center bg-white p-4 pt-12 lg:items-center lg:pt-4">
      <div className="w-full max-w-md">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-black">
            Available Schedules
          </h1>
        </header>
        <div className="flex flex-col space-y-2">
          {schedules.length > 0 ? (
            schedules.map((scheduleId) => (
              <Button key={scheduleId} href={`/schedule/${scheduleId}`}>
                {scheduleId.replace(/_/g, ' ')}
              </Button>
            ))
          ) : (
            <p className="text-center text-gray-500">
              No schedules found.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}