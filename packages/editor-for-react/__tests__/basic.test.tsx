/**
 * @description react component test
 * @author wangfupeng
 */

import React from 'react'
import { render, cleanup, waitFor } from '@testing-library/react'
import BasicInHooks from '../example/pages/BasicInHooks'
import SimpleInHooks from '../example/pages/SimpleInHooks'
import BasicInClass from '../example/pages/BasicInClass'

describe('React editor component', () => {
  afterEach(cleanup)

  it('basic editor in class component', async () => {
    const { getByTestId } = render(<BasicInClass />)
    const editorContainerElem = await waitFor(() => getByTestId('editor-container'))

    const toolbar = editorContainerElem.querySelectorAll('div[data-w-e-toolbar]')[0]
    expect(toolbar).toBeTruthy()
    const editor = editorContainerElem.querySelectorAll('div[data-w-e-textarea]')[0]
    expect(editor).toBeTruthy()
  })

  it('basic editor in Hooks', async () => {
    const { getByTestId } = render(<BasicInHooks />)
    const editorContainerElem = await waitFor(() => getByTestId('editor-container'))

    const toolbar = editorContainerElem.querySelectorAll('div[data-w-e-toolbar]')[0]
    expect(toolbar).toBeTruthy()
    const editor = editorContainerElem.querySelectorAll('div[data-w-e-textarea]')[0]
    expect(editor).toBeTruthy()
  })

  it('simple editor in Hooks', async () => {
    const { getByTestId } = render(<SimpleInHooks />)
    const editorContainerElem = await waitFor(() => getByTestId('editor-container'))

    const toolbar = editorContainerElem.querySelectorAll('div[data-w-e-toolbar]')[0]
    expect(toolbar).toBeTruthy()
    const editor = editorContainerElem.querySelectorAll('div[data-w-e-textarea]')[0]
    expect(editor).toBeTruthy()
  })
})
