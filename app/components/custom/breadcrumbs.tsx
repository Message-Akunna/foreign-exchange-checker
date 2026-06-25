import { Link } from "react-router";
interface BreadcrumbItemInt {
  name: string;
  label?: string;
  path?: string;
}
const Breadcrumbs = ({ data = [] }: { data: BreadcrumbItemInt[] }) => {
  return (
    <div className="bg-muted">
      <div className="mx-auto text-muted-foreground">
        <div className="flex font-medium font-text">
          <Link className="hover:underline" to="/">
            Home
          </Link>
          {data.map((item, key) => (
            <div key={key}>
              <span className="px-2">{">"}</span>
              {item.path ? (
                <Link className="hover:underline" to={item.path}>
                  {item.name}
                </Link>
              ) : (
                <span className="text-foreground">{item.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Breadcrumbs;
