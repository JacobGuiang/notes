interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return <div className="lg:w-1/2 mx-auto px-4 text-base">{children}</div>;
};
