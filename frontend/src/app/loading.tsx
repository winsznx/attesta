export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="h-12 w-12 mx-auto border-4 border-fuchsia-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
