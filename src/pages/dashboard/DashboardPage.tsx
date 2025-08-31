import { useParams } from 'react-router-dom';

export const DashboardPage = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Dashboard ID: {id}</p>
    </div>
  );
};
