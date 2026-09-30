'use client';

import { useState } from 'react';
import { Segmented } from '@/components/ui/segmented';
import {
  CONTACT_REQUESTS,
  DELETION_REQUESTS,
  STATUS_CHANGE_REQUESTS,
  type ContactRequestItem,
  type DeletionItem,
  type StatusChangeItem,
} from '@/lib/admin-mock';
import { STUDENTS, type Student } from '@/lib/mock-data';
import { AdminCohorts } from './admin-cohorts';
import { AdminOverview, type AdminTab } from './admin-overview';
import { AdminPanel } from './admin-panel';
import { AdminRequests } from './admin-requests';

export function AdminDashboard() {
  const [tab, setTab] = useState<AdminTab>('overview');
  const [students, setStudents] = useState<Student[]>(STUDENTS);
  const [contacts, setContacts] =
    useState<ContactRequestItem[]>(CONTACT_REQUESTS);
  const [statusChanges, setStatusChanges] = useState<StatusChangeItem[]>(
    STATUS_CHANGE_REQUESTS,
  );
  const [deletions, setDeletions] = useState<DeletionItem[]>(DELETION_REQUESTS);

  const pending = {
    contacts: contacts.filter((c) => !c.handled).length,
    status: statusChanges.filter((s) => s.state === 'pending').length,
    deletions: deletions.length,
  };
  const pendingTotal = pending.contacts + pending.status + pending.deletions;

  // exclusão em duas etapas: quem pediu já sai da vitrine (visible: false) até o admin confirmar
  const studentsView = students.map((s) =>
    deletions.some((d) => d.studentId === s.id) ? { ...s, visible: false } : s,
  );

  return (
    <div className="flex flex-col gap-8">
      <Segmented
        tone="neutral"
        value={tab}
        onChange={(v) => setTab(v as AdminTab)}
        options={[
          { value: 'overview', label: 'Visão geral' },
          { value: 'cohorts', label: 'Por turma' },
          { value: 'students', label: 'Alunos', count: students.length },
          { value: 'requests', label: 'Solicitações', count: pendingTotal },
        ]}
      />

      {tab === 'overview' && (
        <AdminOverview
          students={studentsView}
          pending={pending}
          onNavigate={setTab}
        />
      )}
      {tab === 'cohorts' && (
        <AdminCohorts
          students={studentsView}
          setStudents={setStudents}
          contacts={contacts}
          statusChanges={statusChanges}
          deletions={deletions}
          onNavigate={setTab}
        />
      )}
      {tab === 'students' && (
        <AdminPanel students={studentsView} setStudents={setStudents} />
      )}
      {tab === 'requests' && (
        <AdminRequests
          students={studentsView}
          contacts={contacts}
          statusChanges={statusChanges}
          deletions={deletions}
          onHandleContact={(id) =>
            setContacts((cur) =>
              cur.map((c) => (c.id === id ? { ...c, handled: true } : c)),
            )
          }
          onResolveStatus={(id, approve) => {
            const req = statusChanges.find((r) => r.id === id);
            setStatusChanges((cur) =>
              cur.map((r) =>
                r.id === id
                  ? { ...r, state: approve ? 'approved' : 'rejected' }
                  : r,
              ),
            );
            if (approve && req) {
              setStudents((cur) =>
                cur.map((s) =>
                  s.id === req.studentId ? { ...s, status: req.requested } : s,
                ),
              );
            }
          }}
          onConfirmDeletion={(id) => {
            const req = deletions.find((d) => d.id === id);
            setDeletions((cur) => cur.filter((d) => d.id !== id));
            if (req)
              setStudents((cur) => cur.filter((s) => s.id !== req.studentId));
          }}
        />
      )}
    </div>
  );
}
