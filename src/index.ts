import _ from 'lodash-es'
import fs from 'fs'
import path from 'path'
import os from 'os'
import webpack from 'webpack'

interface Options {
  outputDir: string
  files: string[]
}

export default class ExtractCommonCssWebpackPlugin {
  public constructor (private options: Options) {}
  
  public apply (compiler: webpack.Compiler) {}
  
  private read (file: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(file, { encoding: 'utf-8' }, (err, data) => {
        if (err) {
          return reject(err)
        }
        return resolve(data)
      })
    })
  }

  private write (p: string, data: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(p, data, (err) => {
        if (err) {
          return reject(err)
        }
        return resolve(void 0)
      })
    })
  }

  private strToBlocks (content: string): string[] {
    const lines = content.split(os.EOL)

    const blocks = []
    let cur = ''
    let enqueueTimes = 0
    let dequeueTimes = 0
    for (const line of lines) {
      cur += `${os.EOL}${line}`
      if (line.includes('{')) {
        enqueueTimes++
      }
      if (line.includes('}')) {
        dequeueTimes++
      }

      if (enqueueTimes && (enqueueTimes === dequeueTimes)) {
        blocks.push(cur)
        cur = ''
        enqueueTimes = 0
        dequeueTimes = 0
      }
    }

    return blocks
  }

  private blocksToStr (blocks: string[]) {
    return blocks.join('')
  }

  async transfer (): Promise<void> {
    const { files, outputDir } = this.options
    
    const originalStrList = await Promise.all(files.map(this.read))
    const originalBlocksList = originalStrList.map(this.strToBlocks)

    const commonBlocks = _.intersection(...originalBlocksList)
    const ownBlocksList = originalBlocksList.map(blocks => _.difference(blocks, commonBlocks))

    await Promise.all([
      this.write(path.join(outputDir, 'common.css'), this.blocksToStr(commonBlocks)),
      ...files.map(async (file, i) => {
        const { base } = path.parse(file)
        await this.write(
          path.join(outputDir, base),
          this.blocksToStr(ownBlocksList[i])
        )
      })
    ])
  }
}
