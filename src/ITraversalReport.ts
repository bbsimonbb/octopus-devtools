export interface ITraversalReport {
    source: String
    topic: String
    version: number
    data: ITraversalReportData    
}
export interface ITraversalReportData {
    nodes: string[]
    nodeDependencies: any
    state:any
    methods: any    
}