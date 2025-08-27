'use client';

import { PropsWithChildren } from 'react';

interface IOrderTrackerPageClientProps extends PropsWithChildren {}

export default function OrderTrackerPageClient(
  props: IOrderTrackerPageClientProps
) {
  const { children } = props;
  return <main>{children}</main>;
}
