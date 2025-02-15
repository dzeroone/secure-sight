'use client'

import { DeleteOutline } from "@mui/icons-material";
import { Box, Divider, IconButton, LinearProgress, List, ListItem, ListItemButton, ListItemText, Pagination, Typography } from "@mui/material";
import { formatRelative } from 'date-fns/fp';
import { useConfirm } from "material-ui-confirm";
import Link from "next/link";
import { enqueueSnackbar } from "notistack";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Page() {
  const confirm = useConfirm();

  const [report, setReport] = useState<{count: number, data: any[]}>({
    count: 0,
    data: []
  })
  const [page, setPage] = useState(1);
  const [processing, setProcessing] = useState(false)

  const getReports = useCallback(async () => {
    try {
      setProcessing(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_SECURE_SIGHT_API_BASE}/elastic/monthly-report-form?page=${page}`)
      if(res.ok) {
        const data = await res.json()
        setReport({
          count: data.count,
          data: data.data
        })
      }
    }catch(e) {
      console.log(e)
    }finally{
      setProcessing(false)
    }
  }, [page])

  const handleReportDeletion = async(report: any) => {
    try {
      setProcessing(true)
      const { confirmed } = await confirm({
        title: 'Saved report is going to be deleted',
        description: 'Are you sure?'
      })

      if(confirmed) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_SECURE_SIGHT_API_BASE}/elastic/monthly-report-form/${report._id}`, {
            method: 'DELETE'
          })

          if(res.ok) {
            enqueueSnackbar("Report has been deleted", {
              variant: "success"
            })
            setTimeout(() => {
              getReports()
            }, 1000)
          }
        }catch(e) {
          console.log(e)
        }
      }
    }catch(e: any) {
      console.log(e)
    }finally{
      setProcessing(false)
    }
  }

  const relativeFromToday = useMemo(() => {
    return formatRelative(new Date())
  }, [])

  const formatSavedDate = useCallback((date: string) => {
    return relativeFromToday(date)
  }, [relativeFromToday])

  useEffect(() => {
    getReports()
  }, [getReports])

  return (
    <Box padding={2}>
      <Typography variant="h4" component='h1'>List of saved monthly reports</Typography>
      <Divider />
      { processing ? (
        <LinearProgress />
      ) : null }
      <List>
        {report.data.map(report => {
          return (
            <ListItem
              secondaryAction={
                <IconButton edge="end" onClick={() => handleReportDeletion(report)}>
                  <DeleteOutline />
                </IconButton>
              }
              disablePadding
              key={report._id}
            >
              <ListItemButton component={Link} href={`/dashboard/monthly-report?id=${report._id}`}>
                <ListItemText
                  primary={`Title: ${report._source.monthly_report.doc_title}`}
                  secondary={`Date: ${formatSavedDate(report._source.savedAt)}`}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
      <Pagination count={Math.floor((report.count/20) + 1)} page={page} onChange={(_, v) => {
        setPage(v)
      }} />
    </Box>
  )
}