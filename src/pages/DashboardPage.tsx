import ChatList from '../components/dashboard/ChatList';
import Navbar from '../components/layout/Navbar';

const DashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <ChatList />
      </main>
    </div>
  );
};

export default DashboardPage; 