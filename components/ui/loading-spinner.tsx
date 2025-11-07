export function LoadingSpinner({ title = "Running simulation..." }: { title?: string }) {
  return ( 
    <div className="flex items-center justify-center space-x-2">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span className="text-muted-foreground">{title}</span>
    </div>
  );
}
