import { SidebarTrigger } from "@/components/ui/layout/Sidebar/sidebar";

type SiteHeaderProps = {
  school: string | null;
};

export const SiteHeader = ({ school }: SiteHeaderProps) => {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="ml-auto font-medium text-sm text-gray-600 gap-2">
          {school}
        </div>
      </div>
    </header>
  );
};
