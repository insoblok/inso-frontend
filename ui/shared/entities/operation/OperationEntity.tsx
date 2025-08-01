import { chakra } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import * as EntityBase from 'ui/shared/entities/base/components';

import { distributeEntityProps } from '../base/utils';

type LinkProps = EntityBase.LinkBaseProps & Pick<EntityProps, 'id'>;

const Link = chakra((props: LinkProps) => {
  const defaultHref = route({ pathname: '/operation/[id]', query: { id: props.id } });

  return (
    <EntityBase.Link
      { ...props }
      href={ props.href ?? defaultHref }
    >
      { props.children }
    </EntityBase.Link>
  );
});

const Icon = (props: EntityBase.IconBaseProps) => {
  return (
    <EntityBase.Icon
      { ...props }
      name={ props.name ?? 'operation_slim' }
      borderRadius="none"
    />
  );
};

type ContentProps = Omit<EntityBase.ContentBaseProps, 'text'> & Pick<EntityProps, 'id'>;

const Content = chakra((props: ContentProps) => {
  return (
    <EntityBase.Content
      { ...props }
      text={ props.id }
    />
  );
});

type CopyProps = Omit<EntityBase.CopyBaseProps, 'text'> & Pick<EntityProps, 'id'>;

const Copy = ({ id, ...props }: CopyProps) => {
  return (
    <EntityBase.Copy
      { ...props }
      text={ id }
    />
  );
};

const Container = EntityBase.Container;

export interface EntityProps extends EntityBase.EntityBaseProps {
  id: string;
}

const OperationEntity = (props: EntityProps) => {
  const partsProps = distributeEntityProps(props);
  const content = <Content { ...partsProps.content }/>;

  return (
    <Container { ...partsProps.container }>
      <Icon { ...partsProps.icon }/>
      { props.noLink ? content : <Link { ...partsProps.link }>{ content }</Link> }
      <Copy { ...partsProps.copy }/>
    </Container>
  );
};

export default React.memo(OperationEntity);

export {
  Container,
  Link,
  Icon,
  Content,
  Copy,
};
