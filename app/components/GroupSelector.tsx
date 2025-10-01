'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from './Button';

interface GroupSelectorProps {
  schedules: string[];
}

const GroupSelector: React.FC<GroupSelectorProps> = ({ schedules }) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const savedGroup = localStorage.getItem('userGroup');
    if (savedGroup && schedules.includes(savedGroup)) {
      setSelectedGroup(savedGroup);
    }
  }, [schedules]);

  const handleSave = () => {
    localStorage.setItem('userGroup', selectedGroup);
    alert('Group saved!');
  };

  const handleViewSchedule = () => {
    if (selectedGroup) {
      router.push(`/schedule/${selectedGroup}`);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <select
        value={selectedGroup}
        onChange={(e) => setSelectedGroup(e.target.value)}
        className="p-2 border rounded text-black"
      >
        <option value="" disabled>Select your group</option>
        {schedules.map((scheduleId) => (
          <option key={scheduleId} value={scheduleId}>
            {scheduleId.replace(/_/g, ' ')}
          </option>
        ))}
      </select>
      <div className="flex space-x-2">
        <Button onClick={handleSave} className="w-full">Save</Button>
        <Button onClick={handleViewSchedule} disabled={!selectedGroup}  className="w-full">
          View Schedule
        </Button>
      </div>
    </div>
  );
};

export default GroupSelector;
