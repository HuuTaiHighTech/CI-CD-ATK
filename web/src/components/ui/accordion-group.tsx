'use client';

import { useState } from 'react';
import Accordion from '~/components/ui/accordion';

type TAccordion = {
  title: string;
  items: string[];
};

type Props = {
  accordions: TAccordion[];
};

function AccordionGroup({ accordions }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return accordions.map((accordion, index) => (
    <Accordion
      key={index}
      title={accordion.title}
      items={accordion.items}
      isOpen={openIndex === index}
      onToggle={() => setOpenIndex(openIndex === index ? null : index)}
    />
  ));
}

export default AccordionGroup;
