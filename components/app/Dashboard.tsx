import Card from "../shared/Card";
import Divider from "../shared/Divider";
import StatusBadge from "../shared/StatusBadge";

const Dashboard = () => {
  return (
    <div className="h-full">
      <h1 className="font-extrabold text-3xl">Dashboard</h1>
      <Divider className="-mx-6" />
      <div className="flex flex-col mt-2 p-2 gap-8">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
          <Card title="Total Videos">
            <label className="text-3xl font-bold text-gray-700">42</label>
          </Card>
          <Card title="Storage Used">
            <label className="text-3xl font-bold text-gray-700">18 GB</label>
          </Card>
          <Card title="Processing">
            <label className="text-3xl font-bold text-gray-700">3</label>
          </Card>
          <Card title="Failed">
            <label className="text-3xl font-bold text-gray-700">1</label>
          </Card>
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <Card title="Recent Upload">
            <div className="space-x-2">
              <label className="text-base font-semi text-gray-700">
                Holiday
              </label>
              <StatusBadge status="ready" />
            </div>

            <div className="space-x-2">
              <label className="text-base font-semi text-gray-700">Demo</label>
              <StatusBadge status="processing" />
            </div>
          </Card>
          <Card title="Top 3 Shares">
            <div className="space-x-2">
              <label className="text-base font-semi text-gray-700">Demo</label>
              <StatusBadge className="bg-gray-200">2 Shares</StatusBadge>
            </div>
            <div className="space-x-2">
              <label className="text-base font-semi text-gray-700">
                Team Meeting
              </label>
              <StatusBadge className="bg-gray-200">3 Shares</StatusBadge>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
