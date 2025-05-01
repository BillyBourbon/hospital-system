'use client';
import { useEffect, useState } from 'react';
import PatientDashboard from './PatientDashboard';
import StaffDashboard from './StaffDashboard';

const Dashboard = () => {
  const [roleId, setRoleId] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Moved get session to an api route as it couldnt be passed from server component to client.
    //
    const fetchSession = async () => {
      const response = await fetch('/api/session', {
        method: 'GET',
      });

      const { session } = await response.json();

      setRoleId(session?.user?.role || null);
      setUserId(session?.user?.id || null);
    };

    fetchSession();
  }, []);

  return (
    <div style={{ width: '100%' }}>
      {roleId === null && (
        <div>
          <h1>Loading Dashboard</h1>
        </div>
      )}
      {roleId === 1 && <PatientDashboard userId={userId} roleId={roleId} />}
      {roleId === 2 && <StaffDashboard userId={userId} roleId={roleId} />}
    </div>
  );
};

export default Dashboard;
