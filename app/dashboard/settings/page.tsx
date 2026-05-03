import React from 'react'
import { ProfileForm } from '@/module/settings/components/profile-form'
import { RepositoryList } from '@/module/settings/components/repository-list'
const SettingsPage = () => {
  return (
    <div className='space-y-6'>
      <div className="">
        <h1 className='text-3xl font-bold tracking-tight'>Settings</h1>
        <p className='text-muted-foreground'>Manage your account settings and connected repository</p>
      </div>
       <ProfileForm></ProfileForm>
      <RepositoryList></RepositoryList>
    </div>
  )
}

export default SettingsPage
