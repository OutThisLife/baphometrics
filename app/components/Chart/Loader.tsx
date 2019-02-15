import { Flex } from 'rebass'

import Text from '../Text'

export default ({ children }) => (
  <Flex
    as="div"
    alignItems="center"
    justifyContent="center"
    css={`
      width: 100%;
      height: 0px;
      padding: 9% 0;
    `}>
    <Text>{children}</Text>
  </Flex>
)
