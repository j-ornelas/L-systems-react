import styled from 'styled-components';

export const FlexCol = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%:
  width: 100%;
`;
export const CenteredCol = styled(FlexCol)`
  justify-content: center;
`;
export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.25em;
`;

export const CenteredRow = styled(FlexRow)`
  justify-content: center;
`;
