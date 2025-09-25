"use client"

import { useEffect, useRef, useState } from 'react'
import QrScanner from 'qr-scanner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Camera, CameraOff, CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function QRScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [scanner, setScanner] = useState<QrScanner | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [scanStatus, setScanStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.destroy()
      }
    }
  }, [scanner])

  const startScanning = async () => {
    try {
      if (!videoRef.current) return

      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => {
          setScanResult(result.data)
          setScanStatus('success')
          setIsScanning(false)
          qrScanner.destroy()
          setScanner(null)
        },
        {
          onDecodeError: (error) => {
            console.log('QR decode error:', error)
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      )

      await qrScanner.start()
      setScanner(qrScanner)
      setIsScanning(true)
      setScanStatus('idle')
      setErrorMessage('')
    } catch (error) {
      console.error('Error starting scanner:', error)
      setErrorMessage('Failed to access camera. Please check permissions.')
      setScanStatus('error')
    }
  }

  const stopScanning = () => {
    if (scanner) {
      scanner.destroy()
      setScanner(null)
    }
    setIsScanning(false)
    setScanStatus('idle')
  }

  const resetScanner = () => {
    setScanResult(null)
    setScanStatus('idle')
    setErrorMessage('')
  }

  const handleAttendanceCheck = async () => {
    if (!scanResult) return

    try {
      // Here you would typically send the QR code data to your backend
      // For now, we'll simulate an API call
      setScanStatus('success')

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // You can add your attendance logic here
      console.log('Processing attendance for:', scanResult)

    } catch (error) {
      console.error('Error processing attendance:', error)
      setScanStatus('error')
      setErrorMessage('Failed to process attendance')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">QR Code Scanner</h2>
          <p className="text-muted-foreground">
            Scan member QR codes to check attendance
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {isScanning ? 'Scanning...' : 'Ready'}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Scanner Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Camera Feed
            </CardTitle>
            <CardDescription>
              Position QR code within the camera frame
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
              {!isScanning && !scanResult && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <CameraOff className="h-12 w-12 mx-auto mb-2" />
                    <p>Camera is off</p>
                  </div>
                </div>
              )}
              {isScanning && (
                <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-32 h-32 border-2 border-primary border-dashed rounded-lg"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {!isScanning ? (
                <Button onClick={startScanning} className="flex-1">
                  <Camera className="h-4 w-4 mr-2" />
                  Start Scanning
                </Button>
              ) : (
                <Button onClick={stopScanning} variant="outline" className="flex-1">
                  <CameraOff className="h-4 w-4 mr-2" />
                  Stop Scanning
                </Button>
              )}

              {scanResult && (
                <Button onClick={resetScanner} variant="outline">
                  Reset
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {scanStatus === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
              {scanStatus === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
              Scan Results
            </CardTitle>
            <CardDescription>
              {scanResult ? 'QR code detected' : 'Waiting for scan...'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {scanResult ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Scanned Data:</h4>
                  <p className="text-sm font-mono break-all">{scanResult}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleAttendanceCheck}
                    className="flex-1"
                    disabled={scanStatus === 'success'}
                  >
                    {scanStatus === 'success' ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Attendance Recorded
                      </>
                    ) : (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Check Attendance
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Camera className="h-8 w-8" />
                </div>
                <p>No QR code scanned yet</p>
                <p className="text-sm">Start scanning to detect codes</p>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{errorMessage}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Scanning Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">1</span>
              </div>
              <h4 className="font-medium mb-1">Grant Camera Access</h4>
              <p className="text-sm text-muted-foreground">
                Allow camera permissions when prompted
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">2</span>
              </div>
              <h4 className="font-medium mb-1">Position QR Code</h4>
              <p className="text-sm text-muted-foreground">
                Center the QR code within the scanning frame
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">3</span>
              </div>
              <h4 className="font-medium mb-1">Wait for Detection</h4>
              <p className="text-sm text-muted-foreground">
                The system will automatically detect and process the code
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}