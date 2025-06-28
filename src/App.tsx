import { useState } from 'react'
import { Play, Pause, SkipForward, Volume2, Users, Settings, Palette } from 'lucide-react'
import { Button } from './components/ui/button'
import { Card } from './components/ui/card'
import { Input } from './components/ui/input'
import { ScrollArea } from './components/ui/scroll-area'

import { Badge } from './components/ui/badge'
import ObjectDetection from './components/ObjectDetection';

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentVideo] = useState({
    title: 'King of the Hill - Season 1 Episode 1 - Pilot',
    duration: '22:30',
    thumbnail: 'https://i.imgur.com/8XrOOXJ.jpg'
  })
  const [users] = useState(['PropaneMaster', 'DaleGribble420', 'HankHill', 'BoomhauerFan', 'LuanneP'])
  const [messages] = useState([
    { user: 'PropaneMaster', message: 'That boy ain\'t right I tell you what!', time: '3:24' },
    { user: 'DaleGribble420', message: 'Pocket sand! Sha sha sha!', time: '3:25' },
    { user: 'HankHill', message: 'Sweet Lady Propane', time: '3:26' },
    { user: 'BoomhauerFan', message: 'dang ol\' man talking bout propane man', time: '3:27' }
  ])
  const [queue] = useState([
    { title: 'King of the Hill - S1E2 - Square Peg', duration: '22:15' },
    { title: 'King of the Hill - S1E3 - The Order of the Straight Arrow', duration: '22:42' },
    { title: 'King of the Hill - S1E4 - Hank\'s Got the Willies', duration: '22:38' }
  ])

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">
                King of the Hill Stream
              </h1>
              <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
                Live • {users.length} viewers
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Palette className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Video Player */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <div className="aspect-video bg-black rounded-lg overflow-hidden relative group">
                <img 
                  src={currentVideo.thumbnail} 
                  alt={currentVideo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="lg"
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-16 h-16"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                  </Button>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/80 rounded-lg p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white font-medium">{currentVideo.title}</span>
                      <span className="text-gray-300">{currentVideo.duration}</span>
                    </div>
                    <div className="mt-2 h-1 bg-gray-600 rounded-full">
                      <div className="h-full w-1/3 bg-orange-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Video Controls */}
            <Card className="bg-slate-800 border-slate-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-slate-600 text-white hover:bg-slate-700"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-slate-600 text-white hover:bg-slate-700"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-slate-600 text-white hover:bg-slate-700"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-400">{users.length} watching</span>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-800 border-slate-700 p-4">
              <h3 className="text-lg font-semibold mb-3 text-orange-400">Add YouTube Video</h3>
              <div className="flex space-x-2">
                <Input
                  placeholder="Paste YouTube URL here..."
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                />
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Add to Queue
                </Button>
              </div>
            </Card>

            <ObjectDetection />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Queue */}
            <Card className="bg-slate-800 border-slate-700">
              <div className="p-4 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-orange-400">Up Next</h3>
              </div>
              <ScrollArea className="h-80">
                <div className="p-4 space-y-3">
                  {queue.map((video, index) => (
                    <div key={index} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer">
                      <div className="w-8 h-8 bg-slate-700 rounded flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{video.title}</p>
                        <p className="text-xs text-gray-400">{video.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>

            {/* Chat */}
            <Card className="bg-slate-800 border-slate-700">
              <div className="p-4 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-orange-400">Chat</h3>
              </div>
              <ScrollArea className="h-80">
                <div className="p-4 space-y-3">
                  {messages.map((msg, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-orange-400">{msg.user}</span>
                        <span className="text-xs text-gray-500">{msg.time}</span>
                      </div>
                      <p className="text-sm text-gray-300">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t border-slate-700">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type a message..."
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                  />
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                    Send
                  </Button>
                </div>
              </div>
            </Card>

            {/* Online Users */}
            <Card className="bg-slate-800 border-slate-700">
              <div className="p-4 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-orange-400">Online ({users.length})</h3>
              </div>
              <div className="p-4 space-y-2">
                {users.map((user, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">{user}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App