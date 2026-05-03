import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { disconnectRepository, getConnectedRepositories } from "../actions";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialogTitle, AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ExternalLink, Trash, Trash2 } from "lucide-react";
import { AlertTitle } from "@/components/ui/alert";

export function RepositoryList() {
    const queryClient = useQueryClient();

    const [disconnectAllOpen, setDisconnectAllOpen] = useState(false)

    const { data: repositories, isLoading } = useQuery({
        queryKey: ['connected-repositories'],
        queryFn: async () => await getConnectedRepositories(),
        staleTime: 1000 * 60 * 2,
        refetchOnWindowFocus: false
    })

    const disconnectMutation = useMutation({
        mutationFn: async (repositoryId: string) => {
            return await disconnectRepository(repositoryId)
        },

        onSuccess: (result) => {
            if (result?.success) {
                queryClient.invalidateQueries({ queryKey: ['connected-repositories'] })
                queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
                toast.success("Repository disconnected successfully")
            } else {
                toast.error(result?.error || "Failed to disconnect repository")
            }
        }
    })

    const disconnectAllMutation = useMutation({
        mutationFn: async (repositoryId: string) => {
            return await disconnectAllRepositories(repositoryId)
        },

        onSuccess: (result) => {
            if (result?.success) {
                queryClient.invalidateQueries({ queryKey: ['connected-repositories'] })
                queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
                toast.success("Repository disconnected successfully")
                setDisconnectAllOpen(false)
            } else {
                toast.error(result?.error || "Failed to disconnect repository")
            }
        }
    })

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Connected Repositories</CardTitle>
                    <CardDescription>Manage your connected GitHub repositories</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse space-y-4">
                        <div className="h-20 bg-muted rounded"></div>
                        <div className="h-20 bg-muted rounded"></div>
                    </div>
                </CardContent>
            </Card>
        )
    }


    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Connected Repositories</CardTitle>
                        <CardDescription>Manage your connected GitHub repositories</CardDescription>
                    </div>
                    {
                        repositories && repositories.length > 0 && (
                            <AlertDialog open={disconnectAllOpen} onOpenChange={setDisconnectAllOpen}>
                                <AlertDialogTrigger asChild>
                                    <Button variant='destructive' size='sm'>
                                        <Trash2 className="h-4 w-4 mr-2"></Trash2>
                                        DisconnectAll
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="flex items-center gap-2">
                                                <AlertTriangle className="h-5 w-5 text-destruction"></AlertTriangle>
                                                Disconnect All Repositories
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will disconnect all {repositories.length} repositories and delete
                                                all associated AI reviews.
                                                This actions cannot be undone
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogAction
                                                onClick={() => disconnectAllMutation.mutate()}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                disabled={disconnectAllMutation.isPending}>
                                                {disconnectAllMutation.isPending ? "Disconnecting..." : 'Disconnect All'}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialogContent>
                            </AlertDialog>
                        )
                    }
                </div>
            </CardHeader>
           <CardContent>
            {!repositories || repositories.length ===0 ? (
                <div className="text-center py-8 text-muted-foreground">
                   <p>No repositories connected yet</p>
                   <p>Connect repositories from the Repository page</p>
                </div>
            ):(
                <div className="space-y-4">
                    {repositories.map((repo)=>{
                        return(
                            <div key={repo.id}
                            className="flex items-center justify-between p-4 border rounded-lg
                            hover:bg-muted/50 transition-colors">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold truncate">{repo.fullName}</h3>
                                        <a href={repo.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-foreground">
                                            <ExternalLink className="h-4 w-4"></ExternalLink>
                                        </a>
                                    </div>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant='ghost' 
                                        size='sm'
                                        className="ml-4 text-destructive hover:text-destructive
                                        hover:bg-destructive/10">
                                            <Trash2 className="h-4 w-4"></Trash2>
                                        </Button>

                                    </AlertDialogTrigger>

                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Disconnect Repository?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will disconnect <strong>{repo.fullName}</strong> and delete
                                                all associated AI reviews.
                                                This action cannot be undone
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                            onClick={()=>disconnectMutation.mutate(repo.id)}
                                            className="bg-destructive text-destructive-foreground
                                        hover:bg-destructive/90"
                                        disabled={disconnectMutation.isPending}>
                                            {disconnectAllMutation.isPending ? "Disconnecting..." : 'Disconnect All'}
                                        </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        )
                    })}
                </div>
            )}
           </CardContent>
        </Card>
    )
}