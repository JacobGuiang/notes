interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return <div className="md:w-5/12 mx-auto px-4 text-base">{children}</div>;
};
