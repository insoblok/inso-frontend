import { test, expect, devices } from '@playwright/experimental-ct-react';
import React from 'react';

import * as blockMock from 'mocks/blocks/block';
import * as dailyTxsMock from 'mocks/stats/daily_txs';
import * as statsMock from 'mocks/stats/index';
import * as txMock from 'mocks/txs/tx';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';
import insertAdPlaceholder from 'playwright/utils/insertAdPlaceholder';

import Home from './Home';

test('default view -@default +@desktop-xl +@dark-mode', async({ mount, page }) => {
  await page.route(buildApiUrl('homepage_stats'), (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(statsMock.base),
  }));
  await page.route(buildApiUrl('homepage_blocks'), (route) => route.fulfill({
    status: 200,
    body: JSON.stringify([
      blockMock.base,
      blockMock.base2,
    ]),
  }));
  await page.route(buildApiUrl('homepage_txs'), (route) => route.fulfill({
    status: 200,
    body: JSON.stringify([
      txMock.base,
      txMock.withContractCreation,
      txMock.withTokenTransfer,
    ]),
  }));
  await page.route(buildApiUrl('homepage_chart_txs'), (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(dailyTxsMock.base),
  }));

  const component = await mount(
    <TestApp>
      <Home/>
    </TestApp>,
  );

  await insertAdPlaceholder(page);

  await expect(component.locator('main')).toHaveScreenshot();
});

// had to separate mobile test, otherwise all the tests fell on CI
test.describe('mobile', () => {
  test.use({ viewport: devices['iPhone 13 Pro'].viewport });

  test('base view', async({ mount, page }) => {
    await page.route(buildApiUrl('homepage_stats'), (route) => route.fulfill({
      status: 200,
      body: JSON.stringify(statsMock.base),
    }));
    await page.route(buildApiUrl('homepage_blocks'), (route) => route.fulfill({
      status: 200,
      body: JSON.stringify([
        blockMock.base,
        blockMock.base2,
      ]),
    }));
    await page.route(buildApiUrl('homepage_txs'), (route) => route.fulfill({
      status: 200,
      body: JSON.stringify([
        txMock.base,
        txMock.withContractCreation,
        txMock.withTokenTransfer,
      ]),
    }));
    await page.route(buildApiUrl('homepage_chart_txs'), (route) => route.fulfill({
      status: 200,
      body: JSON.stringify(dailyTxsMock.base),
    }));

    const component = await mount(
      <TestApp>
        <Home/>
      </TestApp>,
    );

    await insertAdPlaceholder(page);

    await expect(component.locator('main')).toHaveScreenshot();
  });
});
