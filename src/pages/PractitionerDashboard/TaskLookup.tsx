import GNB from '../../shared/GNB'
import Footer from '../../shared/Footer'
import { alertCircleSrc, chevronDownSrc, chevronLeftSrc, chevronRightSrc, xCircleSrc } from '../../shared/icons'
import { useAsyncData } from '../../shared/hooks'
import DataStateNotice from '../../shared/DataStateNotice'
import { MainContent, PageWrapper } from '../../shared/layout.styles'
import {
  Cell,
  MutedCell,
  NavIcon,
  PageNav,
  PageNumber,
  PageNumbers,
  Pagination,
  ReqIdCell,
  SortBar,
  SortChip,
  SortChipIcon,
  StatusCell,
  StatusPill,
  StrongCell as ClientCell,
  TableBody,
  TableContainer,
  TableHeaderRow,
  TableRowEl,
} from '../../shared/Table.styles'
import { EMPTY_TASK_LOOKUP, fetchTaskLookupData, taskStatusColors } from './taskLookupData'
import {
  BannerDescription,
  BannerLeft,
  BannerTexts,
  BannerTitle,
  ClearButton,
  ClearIcon,
  ContextBanner,
  CountBadge,
  ErrorIcon,
  ErrorIconCircle,
  InTableSortBar,
  ResultsCountHeader,
  ResultsTitle,
  TitleGroup,
} from './TaskLookup.styles'

export default function TaskLookup() {
  const { data, loading, error } = useAsyncData(fetchTaskLookupData)
  const view = data ?? EMPTY_TASK_LOOKUP

  return (
    <PageWrapper>
      <GNB />
      <MainContent>
        <DataStateNotice loading={loading} error={error} subject="작업 목록" />
        <ContextBanner>
          <BannerLeft>
            <ErrorIconCircle>
              <ErrorIcon src={alertCircleSrc} alt="" />
            </ErrorIconCircle>
            <BannerTexts>
              <BannerTitle>{view.bannerTitle}</BannerTitle>
              <BannerDescription>{view.bannerDescription}</BannerDescription>
            </BannerTexts>
          </BannerLeft>
          <ClearButton type="button" aria-label="닫기">
            <ClearIcon src={xCircleSrc} alt="" />
          </ClearButton>
        </ContextBanner>

        <ResultsCountHeader>
          <TitleGroup>
            <ResultsTitle>검색 결과 목록</ResultsTitle>
            <CountBadge>{view.rows.length}건</CountBadge>
          </TitleGroup>
        </ResultsCountHeader>

        <TableContainer>
          <InTableSortBar>
            <SortBar>
              <SortChip type="button">
                단계별 상태
                <SortChipIcon src={chevronDownSrc} alt="" />
              </SortChip>
              <SortChip type="button">
                담당자
                <SortChipIcon src={chevronDownSrc} alt="" />
              </SortChip>
              <SortChip type="button">
                날짜
                <SortChipIcon src={chevronDownSrc} alt="" />
              </SortChip>
            </SortBar>
          </InTableSortBar>
          <TableHeaderRow>
            <Cell $width={140}>요청번호</Cell>
            <Cell $width={180}>고객사명</Cell>
            <Cell $width={160}>데이터 유형</Cell>
            <Cell $flex>데이터 상세</Cell>
            <Cell $width={100}>담당자</Cell>
            <Cell $width={110}>등록일</Cell>
            <Cell $width={110}>작업수정일</Cell>
            <Cell $width={120}>상태</Cell>
          </TableHeaderRow>
          <TableBody>
            {view.rows.map((row) => (
              <TableRowEl key={row.reqId}>
                <ReqIdCell $width={140}>{row.reqId}</ReqIdCell>
                <ClientCell $width={180}>{row.client}</ClientCell>
                <Cell $width={160}>{row.dataType}</Cell>
                <Cell $flex>{row.detail}</Cell>
                <Cell $width={100}>{row.assignee}</Cell>
                <MutedCell $width={110}>{row.createdAt}</MutedCell>
                <MutedCell $width={110}>{row.updatedAt}</MutedCell>
                <StatusCell $width={120}>
                  <StatusPill $bg={taskStatusColors[row.status].bg} $color={taskStatusColors[row.status].color}>
                    {row.status}
                  </StatusPill>
                </StatusCell>
              </TableRowEl>
            ))}
          </TableBody>
        </TableContainer>

        <Pagination>
          <PageNav type="button" disabled>
            <NavIcon src={chevronLeftSrc} alt="이전" />
          </PageNav>
          <PageNumbers>
            <PageNumber type="button" $active>
              1
            </PageNumber>
          </PageNumbers>
          <PageNav type="button" disabled>
            <NavIcon src={chevronRightSrc} alt="다음" />
          </PageNav>
        </Pagination>
      </MainContent>
    <Footer />
    </PageWrapper>
  )
}
