export default function PipelineLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen overflow-hidden w-full">
      {children}
    </div>
  );
}
