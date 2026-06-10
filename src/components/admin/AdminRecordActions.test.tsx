import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AdminRecordActions } from './AdminRecordActions'

describe('AdminRecordActions', () => {
  it('calls edit and delete handlers', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    const onDelete = vi.fn()

    render(<AdminRecordActions onEdit={onEdit} onDelete={onDelete} />)

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    await user.click(screen.getByRole('button', { name: 'Delete' }))

    expect(onEdit).toHaveBeenCalledOnce()
    expect(onDelete).toHaveBeenCalledOnce()
  })

  it('shows removing state while deleting', () => {
    render(
      <AdminRecordActions onEdit={() => {}} onDelete={() => {}} deleting />,
    )

    expect(screen.getByRole('button', { name: 'Removing…' })).toBeDisabled()
  })
})
